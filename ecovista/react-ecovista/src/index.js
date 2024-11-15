// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Main.jsx';  // 导入 Main.jsx 作为应用入口

// 创建根节点并渲染 App 组件
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);