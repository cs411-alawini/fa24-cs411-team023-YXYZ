import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';  // 确保路径正确

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        console.log('Attempting login with:', email, password);
        const response = await axios.post('http://localhost:10000/login', {
            email,
            password
        });

        console.log('Login response:', response.data);

        if (response.data.success) {
            const { chat_history, nickname, user_id } = response.data;

            console.log('Navigating to chat with:', chat_history, nickname);
            navigate('/chat', { state: { chatHistory: chat_history, nickname, user_id } });
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="email-login">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="login-actions">
          <button className="sign-up" onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={handleLogin}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;