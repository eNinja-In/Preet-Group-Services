import style from "./login.module.css"
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [empCode, setEmpCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    document.title = "LOGIN PREET GROUPS"

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Start loading

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_LINK}/api/auth/login-user`,
                {
                    method: "POST",
                    body: JSON.stringify({ empCode, password }),
                    headers: { "Content-Type": "application/json" },
                }
            );

            const result = await response.json(); // Parse JSON response once
            if (response.ok && result.success) {
                localStorage.setItem("user", JSON.stringify(result));
                console.error("Login error:", error);
                navigate("/"); // Redirect to home
            } else { setError(result.message || "Login failed. Please try again."); }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false); // End loading
        }
    };


    return (
        <>
            <div className={style.main}>
                <div className={style.login}>
                    <div className={style.loginHead}><h1>PREET GROUPS SERVICES</h1></div>
                    <div className={style.loginError}>{error ? (<p className={style.error}>{error}</p>) : (<p className={style.default}>  </p>)}</div>
                    <div className={style.loginForm}>
                        <form onSubmit={handleSubmit}>
                            <div className={style.inputSection}><div className={style.input}><input type="UserID" value={empCode} placeholder="UserID" onChange={(e) => setEmpCode(e.target.value)} required /></div></div>
                            <div className={style.inputSection}><div className={style.input}> <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /></div></div>
                            <div className={style.submit}><div className={style.submitBtn}><button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button></div></div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    )
}