// src/components/UserDashboard.js
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import './UserDashboard.css';
 // Import custom styles if needed

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashBoard = ({ user, apiUsage, recentActivity }) => {
  // Sample data for API usage chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'API Calls',
        data: apiUsage.monthlyCalls,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} calls`,
        },
      },
    },
  };

  return (
    <div className="dashboard-container bg-gray-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">User Dashboard</h1>

      <div className="user-info bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Details</h2>
        <Detail label="Username" value={user.username} />
        <Detail label="Email" value={user.email} />
        <Detail label="Account Created" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>

      <div className="api-usage bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Usage</h2>
        <Bar data={data} options={options} />
        <p className="text-gray-700 mt-4">
          You have used <strong>{apiUsage.totalCalls}</strong> API calls this month.
        </p>
      </div>

      <div className="recent-activity bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside text-gray-700">
          {recentActivity.map((activity, index) => (
            <li key={index} className="mb-2">
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <p className="text-lg font-medium text-gray-700 mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export default UserDashBoard;
