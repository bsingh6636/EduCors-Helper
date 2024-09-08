// src/components/UserDashboard.js
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import './UserDashboard.css'; // Uncomment if you have custom styles

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = ({ user, apiUsage, recentActivity }) => {
  // Extract data from apiUsage
  console.log(apiUsage)
  const totalApiCalls = apiUsage.totalApiCalls || 0;

  // Prepare data for the chart
  const usageRecords = apiUsage.usageRecords || [];
  const labels = usageRecords.map(record => record.endpoint);
  const data = usageRecords.map(record => record.calls);
  console.log(data,labels)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'API Calls',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        labels: {
          color: '#fff', // Dark theme text color
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} calls`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff', // Dark theme text color
        },
        grid: {
          color: '#444', // Dark theme grid color
        },
      },
      y: {
        ticks: {
          color: '#fff', // Dark theme text color
        },
        grid: {
          color: '#444', // Dark theme grid color
        },
      },
    },
  };

  return (
    <div className="dashboard-container bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">User Dashboard</h1>

      <div className="user-info bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <Detail label="Username" value={user.UserName} />
        <Detail label="Email" value={user.Email} />
        <Detail label="Account Created" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>

      <div className="api-usage bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">API Usage</h2>
        <Bar data={chartData} options={options} />
        <p className="mt-4">
          You have made <strong>{totalApiCalls}</strong> API calls in total.
        </p>
      </div>

      <div className="recent-activity bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside">
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
  <p className="text-lg font-medium mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export default UserDashboard;
