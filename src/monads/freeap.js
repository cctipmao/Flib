import { taggedSum } from 'daggy'
import { compose, identity } from 'fantasy-combinators'
import { of, ap, map } from 'fantasy-land'

const FreeAp = taggedSum('FreeAp', {
    Pure: ['a'],
    Ap: ['a', 'f']
});

FreeAp[of] = FreeAp.Pure;

FreeAp.lift = (x) => {
    return FreeAp.Ap(x, FreeAp.Pure(identity));
};

FreeAp.prototype[ap] = function (f) {
    return this.cata({
        Pure: (g) => f[map](g),
        Ap: (x, y) => FreeAp.Ap(x, f[ap](y[map](g => a => b => g(b,a))))
    });
};

FreeAp.prototype[map] = function (f) {
    return this.cata({
        Pure: (a) => FreeAp.Pure(f(a)),
        Ap: (x, y) => FreeAp.Ap(x, y[map](compose(f)))
    });
};

FreeAp.prototype.map = function (f) {
    return this.cata({
        Pure: (a) => FreeAp.Pure(f(a)),
        Ap: (x, y) => FreeAp.Ap(x, y.map(compose(f)))
    });
};

FreeAp.prototype.foldMap = function (f) {
    return this.cata({
        Pure: FreeAp.Pure,
        Ap: (x, y) => y.foldMap(f)[ap](f(x))
    });
    // return this.cata({
    //     Pure: x => p.map(x),
    //     Ap: (x, y) => y.foldMap(f,p)[ap](f(x))
    // });
};

// FreeAp.prototype.analyze = function(f) {
//     return this.foldMap((a) => Const(f(a))).x;
// };

export default FreeAp;