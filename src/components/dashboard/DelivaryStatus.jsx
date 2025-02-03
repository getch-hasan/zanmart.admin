import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DaliveryStatus = () => {
  // Sample data for delivery status
  const totalOrders = 500;
  const delivered = 320;
  const shipped = 100;
  const processing = 50;
  const inTransit = 30;

  const barData = {
    labels: ['Delivered', 'Shipped', 'Processing', 'In Transit'],
    datasets: [
      {
        label: 'Orders',
        data: [delivered, shipped, processing, inTransit],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#ff5722'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Delivery Status of ${totalOrders} Orders`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample data for payment methods
  const paymentData = {
    labels: ['Cash', 'Card', 'Mobile Banking'],
    datasets: [
      {
        label: 'Payment Methods',
        data: [200, 150, 150],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        hoverOffset: 10,
      },
    ],
  };

  const paymentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Payment Methods',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5 mt-10 space-y-6 md:space-y-0">
      <div className="bg-white p-6 rounded-lg shadow-md" style={{ width: '100%', height: '400px' }}>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md" style={{ width: '100%', height: '400px' }}>
        <Pie data={paymentData} options={paymentOptions} />
      </div>
    </div>
  );
};

export default DaliveryStatus;
