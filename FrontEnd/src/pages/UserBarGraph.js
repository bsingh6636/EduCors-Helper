
import React, { useContext, useEffect, useState } from 'react'
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { presentDateGenerator } from "../import";
// import UserDashBoard from '../pages/UserDashBoard';
import { Context } from '../App';
import { BackEndPort } from '../import';

const BarChart = () => {
  const { userDetails } = useContext(Context)
  const [apiUsage , setApiUsage] = useState(null)
  const time = presentDateGenerator();
  const {  year, month, day } = time;
  // const dayKey = `${year}-${month}-${day}`;
  const monthKey = `${year}-${month}`;
  const labels = [];
  const labelValues = [];

  useEffect(() => {
    if (!userDetails) return
    async function getApiUsage() {
      try {
        const response = await fetch(`${BackEndPort}/apiUsage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userDetails._id }),
        })
        const data = await response.json()
        setApiUsage(data)

      } catch (error) {
        console.error('Error fetching API usage:', error);
      }
    }
    getApiUsage()

  }, [userDetails])

  if (!apiUsage) return ;

  const monthResult = apiUsage.usageRecords.find((record) => record.month === monthKey);

  let days = day;
  for (let i = 0; i < 7; i++) {
    const dayKeys = `${year}-${month}-${days}`;
    labels.unshift(dayKeys);
    const apicallOndays = monthResult.dailyRecord.find((record) => record.date === dayKeys);
    if (apicallOndays && apicallOndays.calls) {
      labelValues.unshift(apicallOndays.calls);
    } else {
      labelValues.unshift(0);
    }
    if (days === 1) break;
    days--;
  }

  const maxLabelValue = Math.max(...labelValues);
  const stepSize = Math.ceil(maxLabelValue / 10);
  console.log(stepSize)

  const data = {
    labels: labels,
    datasets: [
      {
        label: "API Usage",
        backgroundColor: "rgb(255, 99, 132)", // Adjust colors for better visibility
        borderColor: "rgb(255, 159, 64)", // Optional: border color for bars
        data: labelValues,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        grid: {
          color: "#444", // Lighter grid lines for better visibility
        },
        max: maxLabelValue + stepSize,
        ticks: {
          color: "#fff", // White text for y-axis ticks
          stepSize: stepSize,
        },
        title: {
          display: true,
          text: "API Calls",
          color: "#fff", // White title color
        },
      },
      x: {
        grid: {
          color: "#444", // Lighter grid lines for better visibility
        },
        ticks: {
          color: "#fff", // White text for x-axis ticks
        },
        title: {
          display: true,
          text: "Date",
          color: "#fff", // White title color
        },
      },
    },
    plugins: {
      datalabels: {
        color: "#fff", // White color for data labels
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
        },
        anchor: "end",
        align: "-90",
      },
      legend: {
        position: "top",
        labels: {
          color: "#fff", // White color for legend labels
          boxHeight: 10,
          boxWidth: 5,
        },
      },
    },
  };

  return  (
    <div className="components p-4 rounded-lg shadow-lg k ">
      <div>
        <span className='bg-gray-900 m-1 p-1'>Total NO. of Api Calls Made : {apiUsage.totalApiCalls}</span>
      </div>

      {/* <div className="flex justify-center items-center mb-4 mt-3 ">
        <button className="bg-gray-600 text-white mr-4 rounded-lg p-1 shadow-lg hover:scale-105">Weekly</button>
        <button className="bg-gray-600 text-white rounded-lg p-1 shadow-lg hover:scale-105">Monthly</button>
      </div> */}
      <div className=''>
      <Bar data={data} plugins={[ChartDataLabels]} options={options}/>
      </div>
    </div>
  );
};

export default BarChart;
