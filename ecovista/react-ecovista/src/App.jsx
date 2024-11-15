// src/App.jsx
import React from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/homePage'; // 确保您已经创建了这个组件
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />          // 主页设为根路径
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />  // 重定向未知路径到主页
      </Routes>
    </Router>
  );
};

export default App;