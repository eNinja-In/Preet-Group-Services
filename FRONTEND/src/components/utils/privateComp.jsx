import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => Boolean(localStorage.getItem("user"));

export default function Private() {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
