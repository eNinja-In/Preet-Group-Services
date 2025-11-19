import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles for circular progress bar

function PdiReports() {
    const [yesterdayData, setYesterdayData] = useState(0);
    const [currentMonthData, setCurrentMonthData] = useState(0);
    const [loading, setLoading] = useState(true);

    // Function to generate random data for demonstration purposes
    const generateRandomData = () => {
        return Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
    };

    // Fetching mock data for yesterday and current month
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            setTimeout(() => {
                setYesterdayData(generateRandomData()); // Random data for yesterday
                setCurrentMonthData(generateRandomData()); // Random data for current month
                setLoading(false);
            }, 1000); // Simulating an API delay of 1 second
        };

        fetchData();
    }, []);

    // Display loading message while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Calculate percentage progress for both Yesterday and Current Month
    const yesterdayProgress = (yesterdayData / 20) * 100; // Max value for yesterday is 20
    const currentMonthProgress = (currentMonthData / 300) * 100; // Max value for current month is 300

    return (
        <div className="w-full flex flex-wrap">
            <h2 className='text-3xl font-bold'>Key Matrics</h2>
            {/* Key Metrics Section */}
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

            {/* Text Info Section */}
            {/* <div className="">
                <div className="text-lg font-semibold text-gray-700">
                    Yesterday Combine in No: <span className="text-blue-600">{yesterdayData}</span>
                </div>
                <div className="text-lg font-semibold text-gray-700 mt-4">
                    Current Month Combine: <span className="text-blue-600">{currentMonthData}</span>
                </div>
            </div> */}
        </div>
    );
}

export default PdiReports;
