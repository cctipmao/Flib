import { tagged } from 'daggy';
import { ap, map } from 'fantasy-land';
import { ReaderT } from 'fantasy-readers'
import Free from 'fantasy-frees/src/free';
//derived promise to monad
Promise.of = x => Promise.resolve(x)
Promise.prototype.map = function (f) {
    return this.then(f)
}

Free.prototype[map] = function (f) {
    return this.map(f)
}

Promise.prototype.chain = function (f) {
    return this.then(f)
}
export const ReaderTPromise = ReaderT(Promise)
ReaderTPromise.is = function (r) {
    return r.run && r.ask
}
ReaderTPromise.prototype.map = function (f) {
    return this.chain(x => {
        return ReaderTPromise.of(f(x))
    })
}
ReaderTPromise.prototype[map] = function (f) {
    return this.chain(x => {
        return ReaderTPromise.of(f(x))
    })
}
ReaderTPromise.prototype[ap] = function (a) {
    // return this.map(f => a.map(f))
    return this.chain(function (f) {
        return a.map(f);
    });
}
export const UpdaterT = M => {
    const Updater = tagged('run')
    Updater.of = function (tuple) {
        return Updater(stateUpdater => {
            stateUpdater(tuple._2)
            return M.of(tuple)
        })
    }

    Updater.prototype.chain = function (f) {
        return Updater(stateUpdater => {
            return this.run(stateUpdater).chain(tuple => {
                stateUpdater(tuple._2)
                return f(tuple._1).run(stateUpdater)
            })
        })
    }

    Updater.prototype.map = function (f) {
        return Updater(stateUpdater => {
            return this.run(stateUpdater).map(tuple => {
                const result = f(tuple)
                stateUpdater(result._2)
                return result
            })
        })
    }

    return Updater
} 