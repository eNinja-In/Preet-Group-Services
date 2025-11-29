import { Link, Route, Routes, Outlet } from "react-router-dom";
import Btn from "../common/Btn";
import PdiReports from "./Reports/pdiReports";
import PdiForm from "./PdiDataForm";
import CombineDataPage from "./PdiData";
export default function PdiDashboard() {
    return (
        <div className="w-full h-fit bg-gray-50">
            <div className="w-full">
                <div className="w-full max-h-fit min-h-full flex flex-wrap mb-1  border-b-2 border-gray-400 list-none">
                    <Link className="w-1/5" to="Reports"><Btn title="PDI Analysis" /></Link>
                    <Link className="w-1/5" to="add-Data"><Btn title="Add Combine" /></Link>
                    <Link className="w-1/5" to="combines-Data"><Btn title="Combines Data" /></Link>
                </div>

                <div className="w-full h-full">
                    <Routes>
                        <Route path="Reports" element={<PdiReports />} />
                        <Route path="add-Data" element={<PdiForm />} />
                        <Route path="combines-Data" element={<CombineDataPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
