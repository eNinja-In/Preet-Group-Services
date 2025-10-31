import style from "./navbar.module.css"
import logo from "../../assets/logo.webp"
import NavMenu from "/navBar.png"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true);

    const logout = () => (localStorage.clear(), navigate("/login"));
    const auth = JSON.parse(localStorage.getItem("user"))
    return (
        <>
            <div className={style.main}>
                <div className={style.logo1}><img src={logo} alt="preet" /></div>
                <div className={style.logo2}>
                    <span>PREET GROUPS SERVICES</span>
                </div>
            </div>
            <div className={style.barOption}>
                <img src={NavMenu} onClick={() => { setIsVisible(!isVisible); }} alt="" />
            </div>
            {isVisible && (

                <div className={style.navopt}>
                    <div className={style.leftOpt}>
                        <li onClick={() => {navigate('/')}}>DASHBOARD</li>
                        <li>CUSTOMER</li>
                        {/* <li>listoption3</li> */}
                        {/* <li>listoption4</li> */}
                        {/* <li>listoption5</li> */}
                    </div>
                    <div className={style.rightOpt}>
                        <div className={style.authSection}>

                            <button className={style.auth1}>ADMIN</button>
                            {!auth ?
                            <span></span>
                                // <button className={style.auth2}>
                                //     {auth.user ? auth.user.name.includes(" ")
                                //         ? auth.user.name
                                //             .split(" ")
                                //             .map((word) => word[0].toUpperCase())
                                //             .join("") // Initials display
                                //         : auth.user.name.length > 6
                                //             ? (
                                //                 auth.user.name[0] + auth.user.name[1]
                                //             ).toUpperCase() // Two letters
                                //             : auth.user.name
                                //         : "User"}
                                // </button>
                                :
                                <button className={style.auth2} onClick={logout}>LOGOUT</button>
                            }

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}