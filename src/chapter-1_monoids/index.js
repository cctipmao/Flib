import { taggedSum, tagged } from "daggy";

export const Monoid = tagged('Monoid', [
    'id',
    'concat'
])
//加法(幺元为0)
export const Add = Monoid(0, (a, b) => a + b)
//乘法（幺元为1）
export const Product = Monoid(1, (a, b) => a * b)
//最大值(幺元为0，只考虑正数情况)
export const Max = Monoid(0, Math.max)
//最小值(幺元为无穷大，这里取 Number.MAX_VALUE)
export const Min = Monoid(Number.MAX_VALUE, Math.min)

Array.prototype.foldMap = function (monoid) {
    if (this.length === 0) {
        return monoid.id
    } else {
        const [head, ...tail] = this
        return monoid.concat(head, tail.foldMap(monoid))
    }
}

export const Tuple = taggedSum('Tuple', {
    empty: [],
    tuple: ['head', 'tail']
})
export const List = Monoid(Tuple.empty, (t1, t2) => {
    const concat = (t1, t2) => t1.cata({
        empty: () => t2,
        tuple: (head, tail) => Tuple.tuple(head, concat(tail, t2))
    })
    return concat(t1, t2)
})

Tuple.prototype.push = function (another) {
    return this.cata({
        empty: () => Tuple.tuple(another, Tuple.empty),
        tuple: (head, tail) => Tuple.tuple(head, tail.push(another))
    })
}

Tuple.prototype.foldMap = function (monoid) {
    return this.cata({
        empty: () => monoid.id,
        tuple: (head, tail) => monoid.concat(head, tail.foldMap(monoid))
    })
}

export const foldMap = list => monoid => {
    return list.reduce(monoid.concat, monoid.id)
}

export const run = () => {
    const arr = [1,2,3,4]
    console.log(
        arr.foldMap(Add),
        arr.foldMap(Product),
        arr.foldMap(Max),
        arr.foldMap(Min)
    )
    // 10 24 4 1
}