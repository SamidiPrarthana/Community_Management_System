import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/login.css";
import Navbar from "../Page/NavBar";
import Footer from "../Page/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8070/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userType", data.user.userType);

                if (data.user.userType === "Admin") {
                    window.location.href = "/admin/dashboard";
                } else if (data.user.userType === "Staff") {
                    window.location.href = "/staff/dashboard";
                } else if (data.user.userType === "Resident") {
                    window.location.href = "/resident/dashboard";
                } else {
                    window.location.href = "/dashboard";
                }
            } else {
                setError(data.error || "Oops! Invalid credentials.");
            }
        } catch (err) {
            setError("⚠️ Server connection failed. Please try again later.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="login-container">
                <div className="login-box glass-effect">
                    <h2 className="login-title">Welcome Back to Your Community 🏘️</h2>
                    <p className="login-subtext">
                        Enter your credentials to reconnect with your apartment, neighbors, and everything that matters.
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form className="login-form" onSubmit={handleLogin}>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="login-button" type="submit">
                            Log In
                        </button>
                    </form>

                    <div className="login-footer">
                        <a href="#" className="login-link">Forgot Password?</a>
                        <a className="login-link" onClick={() => navigate("/signup")}>
                            New here? Create an account
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;
