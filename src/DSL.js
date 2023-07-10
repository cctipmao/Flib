import Free from 'fantasy-frees/src/free';
import { identity } from 'fantasy-combinators';
import { tagged, taggedSum } from 'daggy';
import { cond } from 'ramda'
import FreeAp from './monads/freeap';
import { ap, of, map } from 'fantasy-land';
const liftAp = x => FreeAp.lift(x)
const { liftFC, liftF, is: isFree } = Free
import { ReaderTPromise as M } from './monads';
import { Coyoneda } from 'fantasy-frees';

Free.prototype[ap] = function (x) {
    return this.chain(function (f) {
        return x.map(f);
    });
};
export const ResultType = taggedSum('ResultType', {
    success: ['data'],
    error: ['error']
})

export const Concurrent = tagged('Concurrent', ['commands'])
Concurrent.of = command => {
    return Concurrent(G => next => [command, G(next)])
}
Concurrent.prototype.map = function (f) {
    return Concurrent(this.commands.map(f))
}
Concurrent.prototype[map] = function (f) {
    return Concurrent(this.commands.map(f))
}
Concurrent.prototype.ap = function (a) {
    return Concurrent(this.commands.map(f => a.map(f)))
}
Concurrent.prototype[ap] = function (a) {
    return Concurrent(this.commands.map(f => a.map(f)))
}

Concurrent.prototype.foldMap = function (a, f) {
    return a.concurentConcat(f(this))
}

export const Just = tagged('Just', ['value'])
export const Domains = taggedSum('Domains', {
    just: ['value'],
    prepairParams: [],
    sendRequest: ['params'],
    mergeState: ['data'],
    getStateFromContext: [],
    updateData: ['data'],
    getPropsFromContext: [],
    reportError: ['error'],
    lift2: []
})

export const httpScript = () =>
    liftFC(Domains.prepairParams)
        .chain(params => liftFC(Domains.sendRequest(params)))
        .chain(
            result => result.cata({
                success: data =>
                    liftFC(
                        liftAp(liftFC(Domains.getPropsFromContext))
                        [ap](liftAp(liftFC(Domains.getStateFromContext)))
                        [ap](liftAp(liftFC(Domains.just(data=>data))))
                        // [ap](liftAp(liftFC(Domains.getPropsFromContext)))
                        // [ap](liftAp(liftFC(Domains.getStateFromContext)))
                    )
                   
                        // .ap(liftFC(Domains.just(data)))
                        // [ap](liftFC(Domains.getStateFromContext(data)))
                        // [ap](liftFC(Domains.getPropsFromContext(data)))

                        .chain(result => {
                            console.log({ result })
                            return liftFC(Domains.updateData(result))
                        })
                ,
                error: error => liftFC(Domains.reportError(error))
            })
        )
// .chain(result => result.cata({
//     success: data =>
//         liftFC(Domains.mergeState(data))
//             .ap(liftFC(Domains.getStateFromContext(data)))
//             .ap(liftFC(Domains.getPropsFromContext(data)))
//             .chain(result => liftFC(Domains.updateData(result))),
//     error: error => liftFC(Domains.reportError(error))
// }))

const run = script => Free.runFC(script, command => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`%c${command?.['@@tag']}`, 'color: green', command?.['@@values'] ?? '')
    }
    if (FreeAp.is(command)) {
        const apResult = command.foldMap(apIntepreter)
        console.log({ apResult })
        return apResult
    } else if (Domains.is(command)) {
        return interpreter(command)
    }
    // else if (Concurrent.is(command)) {
    //     return command.commands.map(f => {
    //         return apData => f(apData).map(run)
    //     }).reduce((m1, m2) => apData => m1(apData).concurentConcat(m2(apData)))
    //     // return command.commands.map(run).reduce((m1, m2) => m1.concurentConcat(m2))
    // }
}, M)
export default run
export const ApActions = taggedSum('ApActions', {
    lift2: []
})
const flip = g => a => b =>g(b,a)
export const apIntepreter = (command) => {
    console.log({ command })
    const apFunctor = run(command)
    return M.of(g => a => b => g(b,a))[ap](apFunctor.map(func =>g=> data => [func(data),g(func,data)]))
    // if (process.env.NODE_ENV === 'development') {
    //     console.log(`%c${command?.['@@tag']}`, 'color: green', command?.['@@values'] ?? '')
    // }
    // console.log({ command })
    // return M.of(first1 => second => {
    //     console.log({ first1, second })
    //   return  run(command(first1))
    //.chain(result1 => second(first1).map(result2 => [result1,result2]))
    // })
    // return M.of(command).chain(com => {
    //     return M(context => Promise.resolve().then(() => {
    //         return first => run(com(first)).run(context)
    //     }))
    // })
    // return M(context =>  data => run(command(data)).run(context))
    // return M(context => Promise.resolve().then(() => {
    //     return run(command).run(context)
    // }))
    // return M.of(data => run(command(data)))
    //         .chain(c => M(context => Promise.resolve().then(()=>{
    //                 return data => c(data).run(context)
    //         })))
}

export const interpreter = command => command.cata({
    lift2: () => free1 => {
        console.log({ free1 })
        return free2 => {
            console.log({ free2 })
            M(context => Promise.all([interpreter(free1).run(context), interpreter(free2).run(context)]))
        }
    }
    ,
    prepairParams: () => M(context => Promise.resolve().then(() => {
        return { params: 'requestParams' }
    })),
    sendRequest: params => M(context => new Promise(resolve => {
        setTimeout(() => {
            resolve(ResultType.success({ requestData: 'data' }))
        }, 2000)
    })),
    getStateFromContext: () => M(context => new Promise(resolve => {
        setTimeout(() => {
            resolve(data => ({ state: 'state' }))

        }, 2000)
    })),
    getPropsFromContext: () => M(context => new Promise(resolve => {
        setTimeout(() => {
            resolve(data => ({ prop: 'prop' }))

        }, 3000)
    })),
    updateData: data => M(context => Promise.resolve().then(async () => {

        console.log('updateData', data,data('123'),data('123')[1](data('123')[0]))
        return data
    })),
    mergeState: data => M(context => Promise.resolve().then(() => {
        console.log({ mergeStateData: data })
        return state => {
            console.log({ mergeStateState: state })
            return props => {
                console.log({ mergeStateProps: props })
                return { ...data, ...state, ...props }
            }
        }
    })),
    reportError: error => M(context => Promise.resolve().then(() => {
        console.log({ error })
    })),
    just: data => M.of(data)
})