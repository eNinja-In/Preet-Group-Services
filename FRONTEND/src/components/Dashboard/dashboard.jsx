import { Link, Route, Routes } from "react-router-dom";
import Btn from "../common/Btn";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-1">

      <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-300">
        <Link to="" className="w-1/5"><Btn title="Dashboard" isActive={true} /></Link>
        <Link to="add-Data" className="w-1/5"><Btn title="New Complaints" /></Link>
        <Link to="combines-Data" className="w-1/5"><Btn title="Combine Data" /></Link>
      </div>

      <div className="w-full h-full">
        <Routes>
          <Route path="" element={<div>Hello add Data</div>} />
          <Route path="add-Data" element={<div>Hello add Data</div>} />
          <Route path="combines-Data" element={<div>Hello Combine Data</div>} />
        </Routes>
      </div>
    </div>
  );
}