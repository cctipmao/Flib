import daggy from 'daggy'
import { compose } from 'fantasy-combinators';
import Either from 'fantasy-eithers';
import { map } from 'fantasy-land';

const Coproduct = daggy.tagged('Coproduct','run');

Coproduct.left = compose(Coproduct)(Either.Left);
Coproduct.right = compose(Coproduct)(Either.Right);

Coproduct.prototype.coproduct = function (f, g) {
    return this.run.fold(f, g);
};
Coproduct.prototype.map = function (f) {
    const go = (x) => x.map(f);
    return Coproduct(this.coproduct(compose(Either.Left)(go), compose(Either.Right)(go)));
};
Coproduct.prototype[map] = function (f) {
    const go = (x) => x[map](f);
    return Coproduct(this.coproduct(compose(Either.Left)(go), compose(Either.Right)(go)));
};

export default Coproduct;