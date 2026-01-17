import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaUser, FaEnvelope, FaCalendarAlt, FaChartBar, FaHistory, FaRocket } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const UserDashboard = ({ user, apiUsage, recentActivity }) => {
  const [view, setView] = useState('weekly');

  const aggregateData = (timestamps, interval) => {
    const formatDate = (date) => {
      const d = new Date(date);
      if (interval === 'daily') {
        return d.toLocaleDateString();
      } else if (interval === 'monthly') {
        return `${d.getMonth() + 1}/${d.getFullYear()}`;
      } else {
        const firstDayOfWeek = new Date(d.setDate(d.getDate() - d.getDay()));
        return firstDayOfWeek.toLocaleDateString();
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

    const usageRecord = apiUsage.usageRecords[0];
    const aggregatedData = aggregateData(usageRecord.timestamps, view);

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    return {
      labels: labels,
      datasets: [
        {
          label: `API Calls (${view.charAt(0).toUpperCase() + view.slice(1)})`,
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  const getDoughnutData = () => {
    const totalCalls = apiUsage.totalApiCalls || 0;
    const limit = 1000;
    const remaining = Math.max(0, limit - totalCalls);
    
    return {
      labels: ['Used', 'Remaining'],
      datasets: [
        {
          data: [totalCalls, remaining],
          backgroundColor: [
            'rgba(99, 102, 241, 0.9)',
            'rgba(55, 65, 81, 0.5)',
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(55, 65, 81, 1)',
          ],
          borderWidth: 2,
          cutout: '75%',
        },
      ],
    };
  };

  const chartData = getChartData();
  const doughnutData = getDoughnutData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (context) => `${context.raw} API calls`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
  };

  const viewButtons = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user.UserName}</span>
          </h1>
          <p className="text-gray-400">Monitor your API usage and manage your account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={FaChartBar}
            label="Total API Calls"
            value={apiUsage.totalApiCalls || 0}
            gradient="from-blue-600 to-indigo-600"
          />
          <StatCard 
            icon={FaRocket}
            label="Active Endpoints"
            value={apiUsage.usageRecords?.length || 0}
            gradient="from-purple-600 to-pink-600"
          />
          <StatCard 
            icon={FaCalendarAlt}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            gradient="from-emerald-600 to-teal-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* API Usage Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">API Usage Overview</h2>
              <div className="flex gap-2">
                {viewButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setView(btn.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      view === btn.key
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <Bar data={chartData} options={options} />
            </div>
          </div>

          {/* Usage Quota */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Usage Quota</h2>
            <div className="relative h-48 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{apiUsage.totalApiCalls || 0}</span>
                <span className="text-sm text-gray-400">of 1000</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-sm text-gray-400">Used</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-600"></span>
                <span className="text-sm text-gray-400">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaUser className="text-indigo-400" />
              Account Details
            </h2>
            <div className="space-y-4">
              <DetailRow icon={FaUser} label="Username" value={user.UserName} />
              <DetailRow icon={FaEnvelope} label="Email" value={user.Email} />
              <DetailRow icon={FaCalendarAlt} label="Account Created" value={new Date(user.createdAt).toLocaleDateString()} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaHistory className="text-purple-400" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-gray-300 text-sm">{activity}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}></div>
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
      <Icon className="text-xl text-white" />
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
      <Icon className="text-gray-400" />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

export default UserDashboard;
