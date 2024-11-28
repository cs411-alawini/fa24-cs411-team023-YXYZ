import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState({
    email: '',
    nickname: '',
    county_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

useEffect(() => {

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/profile', {
                withCredentials: true,
            });
            setProfile(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Failed to fetch profile. Please try again.');
            setLoading(false);
        }
    };

    fetchProfile();
}, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile information
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8000/profile', profile, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      setMessage(response.data.message); // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1>Profile Page</h1>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Nickname:</label>
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>County Code:</label>
            <input
              type="number"
              name="county_code"
              value={profile.county_code}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="profile-actions" type="submit">Update Profile</button>
        </form>
        {message && (
          <p className={`profile-message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        <button
          className="profile-back-button"
          onClick={() => navigate('/info')}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
