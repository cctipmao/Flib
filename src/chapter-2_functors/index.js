
import { tagged } from "daggy"

export const Functor = tagged('Functor', [
    'unit', // a -> Fa
    'map'   // (a -> b) -> Fa -> Fb
])

export const PromiseFunctor = Functor(
    a => Promise.resolve(a),
    f => promiseA => promiseA.then(f)
)

export const ArrayFunctor = Functor(
    a => [a],
    f => arrA => arrA.map(f)
)
export const identity = a => a
export const compose = f => g => a => f(g(a))
export const Coyoneda = Functor(
    x => ({
        value: x,
        mapper: identity
    }),
    f => functorA => ({
        value: functorA.value,
        mapper: compose(f)(functorA.mapper)
    })
)
export const coyoFoldmap = coyo => functor => functor.map(coyo.mapper)(functor.unit(coyo.value))

export const run = () => {
    const Fa = Coyoneda.unit(1)
    const Fb = Coyoneda.map(x => x + 1)(Fa)
    const Fc = Coyoneda.map(x => x + 1)(Fb)
    const Pb = coyoFoldmap(Fb)(PromiseFunctor)
    const Pc = coyoFoldmap(Fc)(PromiseFunctor)
    const Ab = coyoFoldmap(Fb)(ArrayFunctor)
    const Ac = coyoFoldmap(Fc)(ArrayFunctor)
    console.log({ Pb, Ab, Pc, Ac })
}