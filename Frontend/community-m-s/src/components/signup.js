import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/signup.css";
import { registerUser } from "../services/Api";
import Navbar from "../Page/NavBar";
import Footer from "../Page/Footer";

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        userType: "Resident",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await registerUser(formData);
            alert("🎉 Registration Successful!");
            navigate("/login");
        } catch (err) {
            console.error("Error:", err);
            setError(err?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="signup-wrapper">
                <div className="signup-container glass-effect">
                    <h2>Create Your Account 📝</h2>
                    <p>Join our smart apartment community and stay connected</p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <select
                                name="userType"
                                className="signup-select-field"
                                required
                                onChange={handleChange}
                            >
                                <option value="Resident">Resident</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}

                        <button className="signup-button" type="submit">
                            🚀 Sign Up
                        </button>

                        <div className="signup-footer">
                            <p>Already have an account?
                                <button
                                    type="button"
                                    className="signup-link"
                                    onClick={() => navigate("/login")}
                                >
                                    Log In
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SignupForm;
