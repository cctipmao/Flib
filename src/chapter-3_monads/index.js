import { taggedSum, tagged } from "daggy";
import { Monoid } from "../chapter-1_monoids/monoid";
import { Functor } from "../chapter-2_functors";
export const Monad = tagged('Monad', [
    'unit',  // a -> Ma
    'map', // (a -> b) -> Ma -> Mb
    'chain' // Ma -> (a -> Mb) -> Mb

])
monad => Functor(
    monad.unit,
    f => f
)
export const PromiseMonad = Monad(
    a => Promise.resolve(a),
    f => promiseA => promiseA.then(f),
    promiseA => f => promiseA.then(f)
)

//自函子范畴上的幺半群
export const EndoFunctorMonoid = monad => Monoid(
    monad.unit, // a -> Ma
    (fa, fb) => a => monad.chain(fa(a))(fb) // (a -> Mb) -> (b -> Mc) -> a -> Mc
)

export const run = async () => {
//    const all = getUp()
//         .then(washFace)
//         .then(cook)
//         .then(haveBreakfast)
//         .then(gotoWork)
    const getUp = async () => {
        console.log('起床!!')
    }
    const washFace = async () => {
        console.log('洗脸!!')
    }
    const cook = async () => {
        console.log('做饭')
        return '面条'
    }
    const haveBreakfast = async food => {
        console.log('吃' + food)
    }
    const gotoWork = async () => {
        console.log('上班')
    }

    const all = [
        getUp,
        washFace,
        cook,
        haveBreakfast,
        gotoWork
    ].foldMap(EndoFunctorMonoid(PromiseMonad))

    await all()
}