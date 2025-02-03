import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filter, setFilter] = useState('daily');

    // Sample data for the line graph
    const generateData = () => {
        // Depending on the filter, generate different sample data
        let labels = [];
        let data = [];

        switch (filter) {
            case 'daily':
                labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                data = [120, 200, 150, 80, 70, 110, 90];
                break;
            case 'weekly':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [800, 1100, 950, 1200];
                break;
            case 'monthly':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [3000, 3200, 2900, 3500, 3700, 3800, 3600, 3400, 3300, 3100, 3000, 3200];
                break;
            case 'yearly':
                labels = ['2020', '2021', '2022', '2023'];
                data = [35000, 37000, 38000, 40000];
                break;
            default:
                break;
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Total Orders',
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                },
            ],
        };
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Total Orders (${filter.charAt(0).toUpperCase() + filter.slice(1)})`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Orders',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='grid  mt-5 justify-center  w-3/5'>
            <div className="bg-white p-6  rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="mr-2">Start Date:</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div>
                        <label className="mr-2">End Date:</label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                    <div>
                        <label className="mr-2">Filter:</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>
                <Line data={generateData()} options={lineOptions} />
            </div>
        </div>
    );
};

export default LineGraph;
