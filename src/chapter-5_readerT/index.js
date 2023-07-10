import { tagged } from "daggy";
import { EndoFunctorMonoid, Monad, PromiseMonad } from "../chapter-3_monads";
import { DSL, FreeMonad, foldMap } from "../chapter-4_freemonads";

export const Reader = tagged('Reader', ['run'])

export const ReaderTMonad = monad => Monad(
    a => Reader(context => monad.unit(a)),
    f => readerA => ReaderTMonad.chain(readerA)(a => ReaderTMonad.unit(f(a))),
    readerA => f => Reader(context => monad.chain(readerA.run(context))(a => f(a).run(context)))
)

export const M = ReaderTMonad(PromiseMonad)

const interpreter = command => command.cata({
    getUp: () => Reader(async context => {
        console.log('起床!!')
    }),
    washFace: () => Reader(async context => {
        console.log('洗脸!!')
    }),
    cook: () => Reader(async context => {
        console.log('做饭')
        return context.foodInFridge
    }),
    haveBreakfast: food => Reader(async context => {
        console.log('吃' + food)
    }),
    gotoWork: () => Reader(async context => {
        console.log('上班')
    })
})

export const run = async () => {
    const script = DSL.foldMap(EndoFunctorMonoid(FreeMonad))
    const all = foldMap(script())(interpreter, M)
    const foodInFridge = '鸡蛋 面条 西红柿'
    await all.run({ foodInFridge })
}