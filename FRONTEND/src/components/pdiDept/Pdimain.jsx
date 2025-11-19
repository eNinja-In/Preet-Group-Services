import { Link, Route, Routes, Outlet } from "react-router-dom";
import Btn from "../common/Btn";
import PdiReports from "./pdiReports";
import CombineDataRegistration from "./pdiDataEntry";
export default function Pdi() {
    return (
        <div className="w-full h-fit bg-gray-100">
            <div className="w-full p-1">
                <div className="w-full h-fit flex flex-wrap mb-1  border-b-2 border-gray-400 list-none">
                    {/* Buttons with Links for routing */}
                    <Link className="min-w-[18%]" to="Reports"><Btn title="Recent Activity" /></Link>
                    <Link className="min-w-[18%]" to="add-Data"><Btn title="New Combine" /></Link>
                    {/* <Link className="min-w-[18%]" to="report1"><Btn title="Reports Combine 3" /></Link> */}
                    {/* <Link className="min-w-[18%]" to="report2"><Btn title="Reports Combine 4" /></Link> */}
                </div>

                {/* Used Outlet here to render nested routes */}
                <div className="w-full h-full">
                    <Routes>
                        <Route path="Reports" element={<PdiReports />} />
                        <Route path="add-Data" element={<CombineDataRegistration />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
