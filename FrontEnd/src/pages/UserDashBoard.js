import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = ({ user, apiUsage, recentActivity }) => {
  const [view, setView] = useState('weekly'); // State to manage the current view

  // Function to group data by day, week, or month
  const aggregateData = (timestamps, interval) => {
    const formatDate = (date) => {
      const d = new Date(date);
      if (interval === 'daily') {
        return d.toLocaleDateString(); // e.g., '9/8/2024'
      } else if (interval === 'monthly') {
        return `${d.getMonth() + 1}/${d.getFullYear()}`; // e.g., '9/2024'
      } else {
        // For weekly, return the first day of the week (Sunday)
        const firstDayOfWeek = new Date(d.setDate(d.getDate() - d.getDay()));
        return firstDayOfWeek.toLocaleDateString(); // e.g., '9/8/2024'
      }
    };

    const aggregatedData = {};
    timestamps.forEach((timestamp) => {
      const dateKey = formatDate(timestamp);
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }
      aggregatedData[dateKey] += 1;
    });

    return aggregatedData;
  };

  const getChartData = () => {
    if (!apiUsage.usageRecords || apiUsage.usageRecords.length === 0) {
      return { labels: [], datasets: [] };
    }

    const usageRecord = apiUsage.usageRecords[0]; // Assuming a single endpoint for simplicity
    const aggregatedData = aggregateData(usageRecord.timestamps, view);

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    return {
      labels: labels,
      datasets: [
        {
          label: `API Calls (${view.charAt(0).toUpperCase() + view.slice(1)})`,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = getChartData();

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

        {/* Buttons to switch views */}
        <div className="view-buttons mb-4">
          <button onClick={() => setView('weekly')} className={`mr-2 px-4 py-2 rounded ${view === 'weekly' ? 'bg-blue-500' : 'bg-gray-700'}`}>
            Weekly
          </button>
          <button onClick={() => setView('monthly')} className={`mr-2 px-4 py-2 rounded ${view === 'monthly' ? 'bg-blue-500' : 'bg-gray-700'}`}>
            Monthly
          </button>
          <button onClick={() => setView('daily')} className={`px-4 py-2 rounded ${view === 'daily' ? 'bg-blue-500' : 'bg-gray-700'}`}>
            Daily
          </button>
        </div>

        <Bar data={chartData} options={options} />
        <p className="mt-4">
          You have made <strong>{apiUsage.totalApiCalls || 0}</strong> API calls in total.
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
