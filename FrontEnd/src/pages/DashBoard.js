import React, { useContext, useEffect, useState } from 'react'
import UserDashBoard from '../components/UserDashBoard';
import { Context } from '../App';
import { BackEndPort } from '../import';


const DashBoard = () => {
  const { userDetails } = useContext(Context)
  const [usageData, setUsageData] = useState(null)
  useEffect(() => {
    if (!userDetails) return
    async function getApiUsage() {
      console.log(userDetails)
      try {
        const response = await fetch(`${BackEndPort}/apiUsage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userDetails._id }),
        })
        const data = await response.json()
        console.log(data)
        setUsageData(data)

      } catch (error) {
        console.error('Error fetching API usage:', error);
      }
    }
    getApiUsage()

  }, [userDetails])

  const mockUser = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  const mockApiUsage = {
    totalCalls: 1234,
    monthlyCalls: [120, 150, 180, 200, 170, 190, 210],
  };

  const mockRecentActivity = [
    'Logged in from IP 192.168.1.1',
    'Updated profile picture',
    'Changed password',
  ];
  console.log(usageData)
  return !usageData ? null : (
    <UserDashBoard
      user={userDetails}
      apiUsage={usageData}
      recentActivity={mockRecentActivity}
    />
  )
}

export default DashBoard

// // src/components/ApiUsageChart.js
// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import Chart from 'chart.js/auto';

// export const ApiUsageChart = ({ userId }) => {
//     const [data, setData] = useState({ labels: [], datasets: [] });

//     useEffect(() => {
//         const fetchUsageData = async () => {
//             try {
//                 const response = await axios.get(`/api/usage/${userId}`);
//                 const usageData = response.data;

//                 const labels = usageData.map(entry => entry._id);
//                 const values = usageData.map(entry => entry.totalCalls);

//                 setData({
//                     labels,
//                     datasets: [{
//                         label: 'API Calls',
//                         data: values,
//                         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//                         borderColor: 'rgba(53, 162, 235, 1)',
//                         borderWidth: 1,
//                     }],
//                 });
//             } catch (error) {
//                 console.error('Error fetching API usage data:', error);
//             }
//         };

//         fetchUsageData();
//     }, [userId]);

//     return (
//         <div>
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Usage</h2>
//             <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//         </div>
//     );
// };


