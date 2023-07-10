import { taggedSum } from "daggy";
// import { head, tail } from "ramda";

const freeAp = taggedSum('FreeAP2', {
    Pure: ['x'],
    AP: ['head', 'tail']
})

freeAp.prototype.foldMap = function (f) {
    return this.cata({
        Pure: x => f(x),
        AP: (head, tail) => tail.foldMap(f).ap(head)
    })
}
freeAp.prototype.ap = function (freeap2) {
    return this.cata({
        Pure: x => freeap2.map(x),
        AP: (head, tail) => freeAp.AP(head, tail.ap(head))
    })
}

const f1 = g => a => b => g(b)(a)
const f2 = g => a => b => g(b)(a)

const f3 = g3 => f2(f1(g3))
const f4 = g => f2(f3(g)) 
const g = a => b => a + ' + ' + b