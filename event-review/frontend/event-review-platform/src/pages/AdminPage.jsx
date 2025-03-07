import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import EventManagement from '../components/admin/EventManagement';

const AdminPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Dashboard</h1>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/events" element={<EventManagement />} />
      </Routes>
    </div>
  );
};

export default AdminPage;