import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => Boolean(localStorage.getItem("user"));
export function Private() { return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />; }

const isAdmin = () => Boolean(localStorage.getItem("admin"));
export function IsAdminAuth() { return isAdmin() ? <Outlet /> : <Navigate to="/admin-auth" replace />; }