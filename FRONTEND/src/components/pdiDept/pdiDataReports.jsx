import KeyMatrics from "./keyMatrics"
export default function PdiReports() {
    return (
        <div className="w-full h-full">
            <div className="w-full p-1 flex flex-wrap">
                <div className="w-[60%] bg-gray-100 p-6 rounded-lg shadow-md"><KeyMatrics /></div>
                <div className="w-[40%] p-2"></div>
            </div>
            <div className=""></div>
        </div>
    )
}