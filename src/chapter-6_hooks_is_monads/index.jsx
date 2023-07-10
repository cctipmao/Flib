import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as State from 'fantasy-states'
import * as Reader from 'fantasy-readers'
import { Monoid, foldMap } from "../chapter-1_monoids";
const Pure = props => {
    const { first, second, onFirstClick, onSecondClick, total } = props
    return <div>
        <div>first:{first}</div>
        <div>second:{second}</div>
        <div>total:{total}</div>
        <button onClick={onFirstClick}>first + 1</button>
        <button onClick={onSecondClick}>second + 1</button>
    </div>
}
const functionMonoid = Monoid(
    a => a,
    (f, g) => a => f(g(a))
)
const effectReader = Reader(state => {
    useEffect(() => {
        console.log('onChange', state)
    }, [state])
    return state
}).run

const buildState = props => State
    .modify(s => {
        const [first, updateFirst] = React.useState(0)
        const onFirstClick = useCallback(() => {
            return updateFirst(first + 1)
        }, [first])
        return { ...s, first, onFirstClick }
    })
    .chain(() => State.modify(s => {
        const [second, updateSecond] = useState(0)
        const onSecondClick = useCallback(() => {
            return updateSecond(second + 1)
        }, [second])
        return { ...s, second, onSecondClick }
    }))
    .chain(() => State.modify(s => {
        const { first, second } = s
        const total = useMemo(() => first + second, [first, second])
        return { ...s, total }
    })).exec(props)


export default foldMap([Pure, effectReader, buildState])(functionMonoid)

