import { BarLineChart } from "../../common/Chart"
export default function RecentActivity() {
    const barCategories = ['January', 'February', 'March', 'April', 'May'];
    const barData = [30, 40, 35, 50, 49];
    const pieData = [25, 35, 15, 25];
    const pieCategories = ['A', 'B', 'C', 'D'];
    return (
        <>
            <BarLineChart
                chartType="bar"
                categories={barCategories}
                data={barData}
                title="Total Complaint"
            />

        </>
    )
}

// {/* <div className="w-full min-h-screen bg-white p-6">
//       {/* Main Screen Container */}
//       <div className="flex flex-wrap justify-between gap-6">

//         {/* Bar Chart */}
//         <div className="w-full md:w-1/2 lg:w-1/3">
//           <BarLineChart
//             chartType="bar"
//             categories={barCategories}
//             data={barData}
//             title="Monthly Sales"
//           />
//         </div>

//         {/* Line Chart */}
//         <div className="w-full md:w-1/2 lg:w-1/3">
//           <BarLineChart
//             chartType="line"
//             categories={barCategories}
//             data={barData}
//             title="Sales Over Time"
//           />
//         </div>

//         {/* Pie Chart */}
//         <div className="w-full md:w-1/2 lg:w-1/3">
//           <PieChart
//             chartType="pie"
//             categories={pieCategories}
//             data={pieData}
//             title="Category Distribution"
//           />
//         </div>
//       </div>
//     </div> */}