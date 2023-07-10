import { taggedSum } from "daggy";
import { EndoFunctorMonoid, Monad, PromiseMonad } from "../chapter-3_monads";

export const Free = taggedSum('Free', {
    return: ['x'],
    bind: ['command', 'cont']
})

export const FreeMonad = Monad(
    a => Free.return(a),
    f => freeA => FreeMonad.chain(freeA)(x => Free.return(f(x))),
    freeA => f => freeA.cata({
        return: x => f(x),
        bind: (command, cont) => Free.bind(command, x => FreeMonad.chain(cont(x))(f))
    })
)
export const foldMap = free => (interpreter, monad) => {
    return free.cata({
        return: x => monad.unit(x),
        bind: (command, cont) => monad.chain(interpreter(command))(x => foldMap(cont(x))(interpreter, monad))
    })
}
export const liftF = command => Free.bind(command, x => Free.return(x))

export const ADTs = taggedSum('Commands', {
    getUp: [],
    washFace: [],
    cook: [],
    haveBreakfast: ['food'],
    gotoWork: []
})

export const DSL = [
    () => liftF(ADTs.getUp),
    () => liftF(ADTs.washFace),
    () => liftF(ADTs.cook),
    food => liftF(ADTs.haveBreakfast(food)),
    () => liftF(ADTs.gotoWork)
]

const interpreter = command => command.cata({
    getUp: async () => {
        console.log('起床!!')
    },
    washFace: async () => {
        console.log('洗脸!!')
    },
    cook: async () => {
        console.log('做饭')
        return '面条'
    },
    haveBreakfast: async food => {
        console.log('吃' + food)
    },
    gotoWork: async () => {
        console.log('上班')
    }
})

export const run = async () => {
    const script = DSL.foldMap(EndoFunctorMonoid(FreeMonad))
    const all = foldMap(script())(interpreter, PromiseMonad)
    await all
}