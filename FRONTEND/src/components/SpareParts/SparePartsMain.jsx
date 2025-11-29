import { Link, Route, Routes } from "react-router-dom";
import Btn from "../common/Btn";
import AddDispatch from "./Dispatch/AddDispatch";
import DispatchMain from "./Dispatch/MainDispatch";
import ReturnMain from "./Return/ReturnMain";
export default function SparePartsMain() {
    return (
        <div className="w-full min-h-screen bg-gray-50 ">
            <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-300">
                <Link to="" className="w-1/5"><Btn title="Spare Parts" isActive={true} /></Link>
                <Link to="return" className="w-1/5"><Btn title="Parts Return" /></Link>
                <Link to="payment" className="w-1/5"><Btn title="Payment Details" /></Link>
            </div>

            <div className="w-full h-full">
                <Routes>
                    <Route path="" element={<DispatchMain />} />
                    <Route path="add-dispatch" element={<AddDispatch />} />

                    <Route path="return" element={<ReturnMain />} />
                    
                    <Route path="payment" element={<div>Payment Datails</div>} />
                </Routes>
            </div>
        </div>
    );
}
