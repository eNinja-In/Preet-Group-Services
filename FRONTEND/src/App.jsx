/**
 * App Component
 * 
 * This is the main entry point for the application. It handles routing, layout, and 
 * organizes different components like the navigation bar, home content, footbar, and 
 * the main sections of the app (such as dashboard, attendance management, and complaint registration).
 * 
 * Key Features:
 * 1. It uses React Router to handle client-side routing, allowing users to navigate between different pages.
 * 2. Includes private routes that require authentication (using the Private component).
 * 3. Displays various components such as Navbar, MainLeft (Sidebar), MainRight (Sidebar), and Footbar.
 * 4. It has routes for login, dashboard, complaint registration, attendance management, and admin authentication.
 * 5. It provides an error page route for unmatched URLs.
 * 
 * Layout:
 * 1. The main layout is split into three sections: `MainLeft`, `Home` (middle section with routes), and `MainRight`.
 * 2. The `MainLeft` and `MainRight` sections are fixed-width, while the `Home` section takes up most of the remaining space.
 * 3. The layout is responsive and adjusts based on the screen size.
 * 
 * Dependencies:
 * - React Router (`react-router-dom`) for navigation.
 * - TailwindCSS for styling and responsiveness.
 */
import './App.css';
import Login from './components/auth/login';
import Navbar from './components/Bars/navbar';
import MainLeft from './components/home/mainLeftKeys';
import MainRight from './components/home/mainRightKeys';
import Footbar from './components/Bars/footbar';

import Dashboard from './components/home/dashboard';
import RecentActivity from './components/home/Main/RecentActivity';

import AdminAuth from './components/auth/adminAuth';
import { checkAuth } from './components/utils/checkAuth';

import CompReg from './components/serviceDept/custromerComp';
import Attendence from './components/serviceDept/attendence';

import Pdi from './components/pdiDept/Pdimain';
import PdiForm from './components/pdiDept/PdiDataForm';
import CombineDataPage from './components/pdiDept/PdiData';

import { BulkRegister, BulkUpdate } from './uploadData';

import Error from './components/common/error';
import { Private, IsAdminAuth } from './components/utils/privateComp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AppContent() {
  const [isauth, setIsAuth] = useState(true); // State to store authentication status

  // const checkUserAuth = async () => {
  //   await checkAuth(setIsAuth);  // Pass setIsAuth to checkAuth
  // };

  // useEffect(() => {
  //   checkUserAuth();

  //   const intervalId = setInterval(() => {
  //     checkUserAuth(); // Check auth every 1 hour
  //   }, 3600000); // 1 hour interval

  //   return () => clearInterval(intervalId);
  // }, []);

  // if (isauth === null) { setIsAuth(false)}

  return (
    <>
      <Navbar />
      <div className="flex w-full sm:h-[81vh] h-[84vh]">
        <div className="sm:w-[17vw] sm:flex hidden"> <MainLeft /> </div>
        <div className="sm:w-[66vw] w-full sm:px-1 flex flex-row justify-center bg-gray-400 overflow-y-auto overflow-x-hidden">
          {isauth ? (
            <Routes>
              <Route element={<Private />}>
                {/* Define nested routes for DASHBOARD */}
                <Route path="/" element={<Dashboard />} >
                  <Route path="recent" element={<RecentActivity />} />
                  <Route path="add-Data" element={<PdiForm />} />
                  <Route path="combines-Data" element={<CombineDataPage />} />
                </ Route>
                <Route path="/register-Complaint" element={<CompReg />} />
                {/* Define nested routes for Pdi */}
                <Route path="/Pdi" element={<Pdi />}>
                  <Route path="Reports" element={<div>Report 1 Content</div>} />
                  <Route path="add-Data" element={<PdiForm />} />
                  <Route path="combines-Data" element={<CombineDataPage />} />
                </Route>
                <Route path="/BulkRegister" element={<BulkRegister />} />
                <Route path="/BulkUpdate" element={<BulkUpdate />} />
                <Route path="/attendence-management" element={<Attendence />} />
                {/* Define nested routes for ADMIN */}
                <Route element={<IsAdminAuth />} >
                  <Route path="/admin/control" element={<div>Hello world</div>} />
                  <Route path="/admin/user-settings" element={<div>Hello Admin</div>} />
                </Route>
                <Route path="/admin-auth" element={<AdminAuth />} />
                <Route path="/*" element={<Error />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<Error />} />
            </Routes>
          )}
        </div>
        <div className="sm:w-[17vw] sm:flex hidden"> <MainRight /> </div>
      </div>
      <Footbar />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
