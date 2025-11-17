/**
 * Navbar Component
 * 
 * This component is the navigation bar of the application. It includes:
 * 1. A logo section displaying the brand's logo and name.
 * 2. A hamburger-style menu button (for mobile) to toggle visibility of the navigation options.
 * 3. Dynamic routing links (Dashboard, Customer, etc.) and authentication options (Admin login or logout).
 * 
 * Key Features:
 * 1. Logo section displays the logo and the brand name (Preet Groups Services).
 * 2. The navigation options (`leftOpt`) include links like Dashboard, Customer, etc. These can be expanded or modified as needed.
 * 3. Authentication section (`rightOpt`) has a login/logout button depending on whether a user is authenticated (based on localStorage).
 * 4. On mobile view, the navigation options are hidden by default and can be toggled by clicking the hamburger menu.
 * 
 * Layout:
 * 1. The navbar is responsive and adjusts its layout depending on screen size (mobile and desktop views).
 * 2. On smaller screens, the navbar becomes a toggleable dropdown with a hamburger button.
 * 3. The authentication buttons (Admin, Logout) are placed on the right of the navbar.
 * 4. TailwindCSS is used for styling and responsiveness.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.webp"; // Update this path accordingly

export default function Navbar() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const auth = JSON.parse(localStorage.getItem("user"));

    return (
        <>
            <div className="flex justify-between items-center p-2 bg-[#0766AD] text-white">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img src={logo} alt="Preet Groups Logo" className="w-20 h-auto" />
                    <span className="ml-4 text-3xl font-bold">PREET GROUPS SERVICES</span>
                </div>
                {/* Mobile Menu Icon */}
                <div className="block lg:hidden cursor-pointer" onClick={() => setIsVisible(!isVisible)} ><img src="/navBar.png" alt="Menu" className="w-10 h-auto" /></div>
            </div>

            {/* Navigation Menu - Mobile/Tablet */}
            {isVisible && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <ul className="space-y-4 text-xl">
                            <li className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => navigate("/")} >Dashboard</li>
                            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Customer</li>
                            <li className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => navigate("/admin-auth")} >Admin</li>
                            <li className="text-red-600 hover:text-red-800 cursor-pointer" onClick={logout}>Logout</li>
                        </ul>
                    </div>
                </div >
            )
            }

            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-between items-center p-2 bg-[#0d86e0]">
                {/* Left Navigation */}
                <div className="flex space-x-8">
                    <button className="text-white hover:bg-blue-600 p-2 rounded-lg cursor-pointer" onClick={() => navigate("/")} > Dashboard </button>
                    <button className="text-white hover:bg-blue-600 p-2 rounded-lg cursor-pointer"> Customer</button>
                </div>

                {/* Right Navigation */}
                <div className="flex items-center space-x-4">
                    <>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 cursor-pointer" onClick={() => navigate("/admin-auth")} > Admin </button>
                        <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-red-800 cursor-pointer" onClick={logout} >Logout</button>
                    </>
                </div>
            </div>
        </>
    );
}
