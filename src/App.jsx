import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import Coproduct from './libs/conproduct'
import Option from 'fantasy-options'
import Identity from 'fantasy-identities';
import Free from 'fantasy-frees/src/free';
import './App.css'
import { identity } from 'fantasy-combinators';
import interpreter, { httpScript, } from './DSL';
import { ReaderTPromise } from './monads';
import State from 'fantasy-states';
import { head, tail } from 'ramda';
import { run } from './chapter-0_church_number'
import HooksMonadComponents from './chapter-6_hooks_is_monads'
const { liftFC } = Free

function App() {
  run()
  // return ''
  return <HooksMonadComponents />
}
// const invoke = script => Free.runFC(script, command => {
//   if (process.env.NODE_ENV === 'development') {
//     console.log(`%c${command?.['@@tag']}`, 'color: green', command?.['@@values'] ?? '')
//   }
//   return interpreter(command)
// }, ReaderTPromise) 
// const useStateM = name => State.modify(s => {
//   const [value, setter] = useState(s[name].initValue)
//   return {
//     ...s,
//     [name]: {
//       value,
//       setter
//     }
//   }
// })

// const useEffectM = invoker => State.modify(s => {
//   useEffect(...invoker(s))
//   return s
// })
// const name = 'count'
// const AppHooks = useStateM(name)
//   .chain(() => useEffectM((s) => [
//     () => console.log('count is :', s.count.value),
//     [s.count.value]]))

// function App() {
  // run()
  // const stateResult = AppHooks.run({ [name]: { initValue: 0 } })

  // const { value: count, setter: setCount } = stateResult._2[name]

  // const f = x => x * 2

  // const List = head => tail => ({
  //   head, tail
  // })
  // const getFirstNList = f => {
  //   const getXfromN = x => n => {
  //     if (x < n) {
  //       return List(f(x))(getXfromN(x + 1)(n))
  //     } else {
  //       return List(f(x))(null)
  //     }
  //   }
  //   return getXfromN(0)
  // }
  // const list1 = getFirstNList(f)(16)
  // console.log({ list1 })
  // interpreter(httpScript()).run()
  // return (
  //   <div className="App">
  //     <button onClick={() => interpreter(httpScript()).run({})}>request</button>
  //   </div>
  // )
  // return <HooksM />
// }

export default App
