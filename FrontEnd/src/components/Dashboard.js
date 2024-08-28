// src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">Get a quick glance at your stats and recent activity.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <p className="text-gray-700">Manage and track your enrolled courses.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          <p className="text-gray-700">View and submit your assignments.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Grades</h2>
          <p className="text-gray-700">Check your grades and performance.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-700">Update your profile and application settings.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p className="text-gray-700">Manage your notifications and alerts.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
