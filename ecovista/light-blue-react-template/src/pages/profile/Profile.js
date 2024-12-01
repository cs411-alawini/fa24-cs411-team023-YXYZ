import React, { useState, useEffect } from 'react';
import axios from 'axios';
import s from './Profile.module.scss';

function ProfilePage() {
  const [profile, setProfile] = useState({
    email: '',
    nickname: '',
    county_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    <div className={s.profileContainer}>
      <div className={s.profileBox}>
        <h1>Profile Page</h1>
        <form className={s.profileForm} onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
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
              placeholder="Enter your nickname"
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
              placeholder="Enter your county code"
            />
          </div>
          <button className={s.profileActions} type="submit">
            Update Profile
          </button>
        </form>
        {message && (
          <p
            className={`${s.profileMessage} ${
              message.includes('Failed') ? s.error : s.success
            }`}
          >
            {message}
          </p>
        )}

        <button
          className={s.profileBackButton}
          onClick={() => (window.location.href = '/Dashboard')}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
