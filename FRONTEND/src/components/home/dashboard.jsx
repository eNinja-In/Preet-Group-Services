import style from "./dashboard.module.css"
import { BarLineChart, PieChart } from "../common/Chart"
export default function Dashboard() {
    const barCategories = ['January', 'February', 'March', 'April', 'May'];
    const barData = [30, 40, 35, 50, 49];
    const pieData = [25, 35, 15, 25];
    const pieCategories = ['A', 'B', 'C', 'D'];
    return (
        <div className={style.main}>
            <div className={style.mainScreen}>
                <BarLineChart chartType="bar" categories={barCategories} data={barData} title="Monthly Sales" />
                <BarLineChart chartType="line" categories={barCategories} data={barData} title="Sales Over Time" />
                <PieChart chartType="pie"categories={pieCategories} data={pieData} title="Category Distribution" />
                {/* <Chart chartType="line" categories={barCategories} data={barData} title="Sales Over Time"/> */}
            </div>
        </div>
    )
}
