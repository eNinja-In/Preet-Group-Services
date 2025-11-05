import style from './adminAuth.module.css'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";

export default function AdminAuth() {
    const auth = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const _id = (`${auth.user.id}`)
    const [adminCode, setAdminCode] = useState('')
    const [passKey, setPassKey] = useState('')
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state


    useEffect(() => {
        if (auth && auth.user && auth.user.name) {
            setName(auth.user.name);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Start loading

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_LINK}/api/auth/login-admin`,
                {
                    method: "POST",
                    body: JSON.stringify({ _id, adminCode, adminKey: passKey }),
                    headers: { "Content-Type": "application/json" },
                }
            );

            const result = await response.json(); // Parse JSON response once
            if (response.ok && result.success) {
                // localStorage.setItem("user", JSON.stringify(result));
                navigate("/"); // Redirect to home
            }
            else { setError(result.message || "Login failed. Please try again."); }
        }
        catch (error) {// alert.error("Login error:", error);
            setError("An unexpected error occurred. Please try again later.");
        }
        finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className={style.main}>
            <div className={style.admin}>
                <form className={style.formWrapper}>
                    <div className={style.adminLogin}>
                        <h1>ADMIN LOGIN</h1>
                        <div className={style.loginError}>{error ? (<p className={style.error}>{error}</p>) : (<p className={style.default}>  </p>)}</div>

                        <div className={style.inputSection}>
                            <div className={style.input}><input type="text" placeholder="EMPLOYEE" value={name.toUpperCase()} onChange={(e) => setName(e.target.value)} required /></div>
                            <div className={style.input}><input type="text" placeholder="ENTER ADMIN CODE" value={adminCode.toUpperCase()} onChange={(e) => setAdminCode(e.target.value)} required /></div>
                            <div className={style.input}><input type="password" placeholder="ADMIN PASSKEY" value={passKey.toUpperCase()} onChange={(e) => setPassKey(e.target.value)} required /></div>
                        </div>
                        <div className={style.submitSection}><button onClick={handleSubmit}>Login</button></div>
                    </div>
                </form>
            </div>
        </div>
    )
}

// /login-admin

