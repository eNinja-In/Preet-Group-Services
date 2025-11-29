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