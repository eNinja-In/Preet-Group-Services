import { Link, Route, Routes, Outlet } from "react-router-dom";
import Btn from "../common/Btn";
import PdiReports from "./pdiDataReports";
import CombineDataRegistration from "./pdiDataEntry";
import Error from "../common/error";
export default function Pdi() {
    return (
        <div className="w-full h-full bg-white">
            <div className="w-full p-1">
                <div className="w-full h-fit flex flex-wrap mb-1 bg-blue-200 border-b-2 border-amber-900 list-none">
                    {/* Buttons with Links for routing */}
                    <Link className="min-w-[18%]" to="Reports"><Btn title="Reports" /></Link>
                    <Link className="min-w-[18%]" to="add-Data"><Btn title="Add Data" /></Link>
                    <Link className="min-w-[18%]" to="report1"><Btn title="Reports Combine 3" /></Link>
                    <Link className="min-w-[18%]" to="report2"><Btn title="Reports Combine 4" /></Link>
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
