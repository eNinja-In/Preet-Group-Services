/**
 * Dashboard Component
 *
 * Displays various charts (bar, line, pie) using reusable `BarLineChart` and `PieChart` components.
 * The data for each chart is provided as props and rendered accordingly.
 * Responsive design is implemented using Tailwind CSS.
 *
 * Props (static data in this case):
 * - barCategories: Array of categories for the bar chart.
 * - barData: Array of data for the bar chart.
 * - pieCategories: Array of categories for the pie chart.
 * - pieData: Array of data for the pie chart.
 */

import { BarLineChart, PieChart } from "../common/Chart";

export default function Dashboard() {
  const barCategories = ['January', 'February', 'March', 'April', 'May'];
  const barData = [30, 40, 35, 50, 49];
  const pieData = [25, 35, 15, 25];
  const pieCategories = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Main Screen Container */}
      <div className="flex flex-wrap justify-between gap-6">

        {/* Bar Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <BarLineChart 
            chartType="bar" 
            categories={barCategories} 
            data={barData} 
            title="Monthly Sales"
          />
        </div>

        {/* Line Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <BarLineChart 
            chartType="line" 
            categories={barCategories} 
            data={barData} 
            title="Sales Over Time" 
          />
        </div>

        {/* Pie Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <PieChart 
            chartType="pie" 
            categories={pieCategories} 
            data={pieData} 
            title="Category Distribution" 
          />
        </div>
      </div>
    </div>
  );
}
