import { KeyMatrics, MonthlyGraph, QuickAction } from "../helper/pdiDashboard"
export default function PdiReports() {
    return (
        <div className="w-full h-full flex flex-wrap">
            <div className="w-full p-1  h-full flex flex-wrap gap-5 ">
                <div className="w-4/7 bg-white p-5 rounded-lg shadow-md h-full"><KeyMatrics /></div>
                <div className="w-2/5 rounded-lg h-full"><QuickAction /></div>
                <div className="w-5/7 bg-white p-5 rounded-lg shadow-md h-full"><MonthlyGraph /></div>
            </div>
            <div className=""></div>
        </div>
    )
}