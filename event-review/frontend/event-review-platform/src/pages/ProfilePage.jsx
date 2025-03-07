import React from 'react';
import Profile from '../components/auth/Profile';

const ProfilePage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Your Profile</h1>
      <Profile />
    </div>
  );
};

export default ProfilePage;