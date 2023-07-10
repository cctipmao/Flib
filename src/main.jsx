import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
/**
 * 客户端渲染，服务端渲染。
 * api 冲突，隔离。
 * React 基本原理，jsx vdom diff 
 * hooks 基本实现 好处，坏处
 * 
 * 
 * 
 * 
 */
React.createFactory
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
