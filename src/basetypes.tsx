import { empty } from "ramda"
import { useCallback, useEffect, useMemo, useState } from "react"

interface Monoid<T> {
    id: T
    concat: (first: T) => (other: T) => T
}

const Add: Monoid<number> = {
    id: 0,
    concat: first => other => first + other
}

const Max: Monoid<number> = {
    id: 0,
    concat: first => other => Math.max(first, other)
}

const List: Monoid<any[]> = {
    id: [],
    concat: first => other => first.concat(other),
}

type FoldMap<T> = (m: Monoid<T>) => (a: T[]) => T

const foldMap = m => a => {
    return a.reduce(m.concat, m.id)
}

interface FreeObject<T> {
    head: T
    tail: Free<T>
}

type Free<T> = FreeObject<T> | null

type FreeMonoid<T> = Monoid<Free<T>>

const freeMonoid: FreeMonoid<any> = {
    id: null,
    concat: first => other => ({
        head: first,
        tail: {
            head: other,
            tail: null
        }
    })
}

const useControl = value => {
    const [innerValue, setInnerValue] = useState(value)
    const onChange = useCallback(newValue => {
        if (newValue !== innerValue) {
            setInnerValue(newValue)
        }
    }, [innerValue])
    useEffect(() => {
        if (value !== innerValue) {
            setInnerValue(value)
        }
    }, [value])
    return [innerValue, onChange]
}

const useSelect = (value, options) => {
    const [innerValue, onChange] = useControl(value)
    const selectedItem = useMemo(() => options.find(item => item.value === innerValue), [innerValue])
    return [innerValue, onChange, selectedItem]
}
const useActivable = () => {
    return  useState(false)
}