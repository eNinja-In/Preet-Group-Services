import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles for circular progress bar

export function KeyMatrics() {
    const [yesterdayData, setYesterdayData] = useState(0);
    const [currentMonthData, setCurrentMonthData] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            setTimeout(() => {
                setYesterdayData(15); // Random data for yesterday
                setCurrentMonthData(200); // Random data for current month
                setLoading(false);
            }, 1000); // Simulating an API delay of 1 second
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const yesterdayProgress = (yesterdayData / 20) * 20;
    const currentMonthProgress = (currentMonthData / 300) * 100;

    return (
        <div className="w-full flex flex-wrap">
            <h2 className='text-3xl font-bold'>Key Matrics</h2>
            <div className="flex ">
                {/* Circle 1: Yesterday Combine in No */}
                <div className="flex flex-col items-center justify-center p-8 ">
                    <CircularProgressbar
                        value={yesterdayProgress}
                        text={`${yesterdayData}`}
                        maxValue={20}
                        styles={buildStyles({
                            textSize: '24px',
                            pathColor: '#0766AD',
                            textColor: '#2196F3',
                            trailColor: '#daebf7',
                        })}
                    />
                    <div className="text-l text-gray-500 mt-2">Yesterday Combine</div>
                </div>

                {/* Circle 2: Current Month Combine */}
                <div className="flex flex-col items-center justify-center p-8">
                    <CircularProgressbar
                        value={currentMonthProgress}
                        text={`${currentMonthData}`}
                        maxValue={100}
                        styles={buildStyles({
                            textSize: '24px',
                            pathColor: '#0766AD',
                            textColor: '#2196F3',
                            trailColor: '#daebf7',
                        })}
                    />
                    <div className="text-l text-gray-500 mt-2">{new Date().toLocaleString('default', { month: 'long' })} Combine</div>
                </div>
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';
export function QuickAction() {
    return (
        <div className="w-full">
            <div className="w-full">
                <h1 className='w-full text-2xl font-bold my-5'>Quick Action</h1>
                <div className="w-full flex justify-center text-white bg-[#0766AD] gap-4 p-4 rounded-md shadow-md " >
                    <Link className="w-3/10text-white font-bold flex flex-col justify-center items-center cursor-pointer" to={"/pdi/add-Data"}>
                        <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 344.34 344.34" xml:space="preserve" stroke="#ffffff" stroke-width="1.377356">
                            <g>
                                <polygon points="183.627,44.708 160.7,44.646 160.7,154.779 50.6,154.779 50.6,177.718 160.7,177.718 160.7,287.821 183.627,287.821 183.627,177.718 293.743,177.718 293.743,154.779 183.627,154.779 "></polygon>
                            </g>
                        </svg>
                        Add Combine
                    </Link>
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={"/"}> hello</Link>
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={""}> hi</Link>
                </div>
            </div>
        </div>
    )
}







import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export function MonthlyGraph() {
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const data = [];
        const months = [];

        for (let i = 5; i >= 0; i--) {
            const month = new Date();
            month.setMonth(month.getMonth() - i);
            months.push(month.toLocaleString('default', { month: 'long' }));
            data.push(Math.floor(Math.random() * 100) + 10); // Random data between 10 and 100
        }

        setMonthlyData({ months, data });
    }, []);

    const chartData = {
        labels: monthlyData.months,
        datasets: [
            {
                label: 'Total Combine',
                data: monthlyData.data,
                borderColor: '#0766AD',
                backgroundColor: 'rgba(7, 102, 173, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="w-full flex flex-col items-center p-8">
            <h2 className="text-3xl font-bold mb-6">Monthly Total Combine</h2>
            {!monthlyData.length > 0 ? (
                <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Monthly Data' } } }} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}


