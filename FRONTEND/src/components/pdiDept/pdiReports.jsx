import { KeyMatrics, MonthlyGraph, QuickAction } from "./helper/pdiDashboard"
export default function PdiReports() {
    return (
        <div className="w-full h-full flex flex-wrap">
            <div className="w-full p-1  h-full flex flex-wrap items gap-5 ">
                <div className="w-1/2 bg-white p-4 rounded-lg shadow-md h-full"><KeyMatrics /></div>
                <div className="w-[40%]  p-8 rounded-lg h-full"><QuickAction /></div>

                <div className="w-2/3 bg-white p-4 rounded-lg shadow-md h-full"><MonthlyGraph /></div>
                {/* <div className="w-[40%] p-2"></div> */}
            </div>
            <div className=""></div>
        </div>
    )
}