import { taggedSum } from "daggy";


// type NatureZero = 'zero'
// interface NatureOneMore { wrap: Nature }
// type Nature = NatureZero | NatureOneMore
// const add = (a: Nature, b: Nature) => {
//     if (a === 'zero') {
//         return b
//     } else {
//         return {
//             wrap: add(a.wrap, b)
//         }
//     }
// }

// const fromInt = (x: number) => {
//     if (x === 0) {
//         return 'zero'
//     } else {
//         return {
//             wrap: fromInt(x - 1)
//         }
//     }
// }
// const toInt = (x: Nature) => {
//     if (x === 'zero') {
//         return 0
//     } else {
//         return 1 + toInt(x.wrap)
//     }
// }
const Nature = taggedSum('Nature', {
    zero: [],
    oneMore: ['n']
})

Nature.prototype.toInt = function () {
    return this.cata({
        zero: () => 0,
        oneMore: n => 1 + n.toInt()
    })
}
Nature.fromInt = function (i) {
    if (i === 0) {
        return Nature.zero
    } else {
        return Nature.oneMore(Nature.fromInt(i - 1))
    }
}
Nature.prototype.add = function (another) {
    return this.cata({
        zero: () => another,
        oneMore: n => Nature.oneMore(n.add(another))
    })
}

export const run = () => {
    const n1 = Nature.fromInt(3)
    const n2 = Nature.fromInt(1)
    const result = n1.add(n2)
    const intResult = result.toInt(result)
    console.log(intResult) // 4

}