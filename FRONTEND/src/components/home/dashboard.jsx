import { Link, Route, Routes } from "react-router-dom";
import RecentActivity from "./Main/RecentActivity";
import Btn from "../common/Btn";
import PdiForm from "../pdiDept/PdiDataForm";
import CombineDataPage from "../pdiDept/PdiData";
// Import Reusable Chart Components (Must be created separately)
import { BarLineChart, PieChart } from "../common/Chart";
// import BarLineChart from "../charts/BarLineChart"; // Assuming this exists
// import PieChart from "../charts/PieChart";         // Assuming this exists
// import useMockDashboardData from "../../hooks/useMockDashboardData"; // New Hook

// --- New Component: Status Card for KPIs ---
// src/hooks/useMockDashboardData.js

const useMockDashboardData = () => {
    // --- 1. Key Performance Indicators (KPIs) ---
    const kpis = [
        { title: "Total Complaints", value: 1245, unit: "Tickets", trend: "+5%" },
        { title: "Open Tickets (PDI)", value: 78, unit: "Critical", trend: "-2%" },
        { title: "Combines Deployed", value: 450, unit: "Units", trend: "+12%" },
        { title: "Avg. Resolution Time", value: 4.2, unit: "Hours", trend: "-10%" },
    ];

    // --- 2. Mock Chart Data ---
    // Bar/Line Chart Data (e.g., Complaints over last 6 months)
    const barCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const barData = [
        { name: 'PDI Issues', data: [30, 40, 45, 50, 49, 60] },
        { name: 'Engine Faults', data: [15, 22, 18, 25, 30, 28] },
    ];

    // Pie Chart Data (e.g., Complaint Distribution by State)
    const pieData = [
        { name: 'Punjab', value: 400 },
        { name: 'Haryana', value: 300 },
        { name: 'UP', value: 200 },
        { name: 'Others', value: 100 },
    ];

    return { kpis, barCategories, barData, pieData, isLoading: false };
};
const StatusCard = ({ title, value, unit, trend }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 transition duration-300 hover:shadow-lg">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="text-3xl font-bold text-gray-800 mt-1">
      {value}
      <span className="text-base font-normal text-gray-400 ml-1">{unit}</span>
    </div>
    <p className={`text-xs font-semibold mt-2 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
      {trend} vs Last Month
    </p>
  </div>
);

// --- Main Dashboard Component ---
export default function Dashboard() {
  const { kpis, barCategories, barData, pieData, isLoading } = useMockDashboardData();
  
  // Use a loading state for better UX
  if (isLoading) {
    return <div className="p-4 text-center text-lg">Loading Dashboard Data...</div>;
  }

  // Define a separate Chart View for the default route ("")
  const MainChartView = () => (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <StatusCard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar/Line Chart (Takes up 2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Complaint Trends</h3>
          {/* Assumes BarLineChart handles `barCategories` for X-axis labels */}
          <BarLineChart categories={barCategories} data={barData} type="bar" /> 
        </div>

        {/* Pie Chart (Takes up 1/3 width) */}
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Complaint Distribution (State)</h3>
          <PieChart data={pieData} />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <RecentActivity />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-300">
        <Link to="" className="w-fit">
          <Btn title="Overview & Charts" isActive={true} /> {/* Added isActive prop concept */}
        </Link>
        <Link to="add-Data" className="w-fit">
          <Btn title="New Complaints (PDI Form)" />
        </Link>
        <Link to="combines-Data" className="w-fit">
          <Btn title="Combine Data View" />
        </Link>
      </div>

      {/* Route Content Area */}
      <div className="w-full h-full">
        <Routes>
          {/* Default Route shows the charts and KPIs */}
          <Route path="" element={<MainChartView />} /> 
          
          {/* Nested PDI Routes */}
          <Route path="add-Data" element={<PdiForm />} />
          <Route path="combines-Data" element={<CombineDataPage />} />
        </Routes>
      </div>
    </div>
  );
}