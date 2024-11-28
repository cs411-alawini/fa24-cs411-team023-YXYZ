import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [countyCode, setCountyCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !nickname || !countyCode || !password || !confirmPassword) {
      alert('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/register', {
        email,
        nickname,
        county_code: countyCode,
        password,
      });
      setLoading(false);
      if (response.data.success) {
        alert('Registration successful');
        navigate('/login');
      } else {
        alert('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <div className="signup-input">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
          />
          <input
            type="text"
            value={countyCode}
            onChange={(e) => setCountyCode(e.target.value)}
            placeholder="Preferred County Code"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </div>
        <div className="signup-actions">
          <button onClick={() => navigate('/login')}>Back to Login</button>
          <button onClick={handleSignUp} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;