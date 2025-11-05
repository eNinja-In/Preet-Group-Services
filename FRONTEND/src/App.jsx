import style from './App.module.css'
import Login from './components/auth/login';
import Navbar from './components/Bars/navbar'
import MainLeft from './components/home/mainLeftKeys';
import MainRight from './components/home/mainRightKeys';
import Footbar from './components/Bars/footbar'
import Dashboard from './components/home/dashboard';
import AdminAuth from './components/auth/adminAuth';


import CompReg from './components/serviceDept/custromerComp';
import Attendence from './components/serviceDept/attendence';


import Error from './components/other/error';
import Private from './components/other/privateComp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function AppContent() {

  return (
    <>
      <Navbar />
      <div className={style.main}>
        <MainLeft />
        <div className={style.home}>
          <Routes>
            <Route element={<Private />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register-Complaint" element={<CompReg />} />
              <Route path="/attendence-management" element={<Attendence />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/*" element={<Error />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <MainRight />
      </div>
      <Footbar />

    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App

