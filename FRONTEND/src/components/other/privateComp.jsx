import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => { return localStorage.getItem("user") ? true : false; };

export default function Private() { return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />; }