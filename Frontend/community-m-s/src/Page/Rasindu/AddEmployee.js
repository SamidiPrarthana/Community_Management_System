import React, { useState } from "react";
import "../../Css/Rasindu/EmployeeForm.css";
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        name: "",
        address: "",
        contact: "",
        email: "",
        role: "",
        hourlyRate: "",
        photo: null,
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (
            !employeeData.name ||
            !employeeData.address ||
            !employeeData.contact ||
            !employeeData.email ||
            !employeeData.role ||
            !employeeData.hourlyRate
        ) {
            setError("All fields must be filled out.");
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(employeeData.email)) {
            setError("Invalid email address.");
            return false;
        }

        const contactPattern = /^[0-9]{10}$/;
        if (!contactPattern.test(employeeData.contact)) {
            setError("Contact number must have 10 digits.");
            return false;
        }

        if (employeeData.photo && employeeData.photo.type !== "image/png") {
            setError("Only PNG images are allowed for the profile photo.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEmployeeData({ ...employeeData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("name", employeeData.name);
        formData.append("address", employeeData.address);
        formData.append("contact", employeeData.contact);
        formData.append("email", employeeData.email);
        formData.append("role", employeeData.role);
        formData.append("hourlyRate", employeeData.hourlyRate);
        if (employeeData.photo) formData.append("photo", employeeData.photo);

        try {
            const res = await fetch("http://localhost:8070/employee/add", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                alert("Employee added successfully!");
                setEmployeeData({
                    name: "",
                    address: "",
                    contact: "",
                    email: "",
                    role: "",
                    hourlyRate: "",
                    photo: null,
                });
            }
        } catch (err) {
            setError("Error submitting: " + err.message);
        }
    };

    return (
        <div className="fbody">
            <div className="registerA">
                <h2 className="titleA">Register Employee</h2>
                {error && <p className="error-messageA">{error}</p>}

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-containerA">
                    <div>
                        <label>Name:</label>
                        <input className="inA" type="text" name="name" value={employeeData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input className="inA" type="text" name="address" value={employeeData.address} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Contact:</label>
                        <input className="inA" type="text" name="contact" value={employeeData.contact} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input className="inA" type="email" name="email" value={employeeData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select className="inA" name="role" value={employeeData.role} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Security">Security</option>
                            <option value="Cleaners">Cleaners</option>
                            <option value="Resident services">Resident Services</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div>
                        <label>Hourly Rate:</label>
                        <input className="inA" type="number" name="hourlyRate" value={employeeData.hourlyRate} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Upload Photo (PNG only):</label>
                        <input 
                            className="inA" 
                            type="file" 
                            name="photo" 
                            accept="image/png" 
                            onChange={handleFileChange} 
                            required 
                            id="photo-upload"
                        />
                        <label htmlFor="photo-upload" className="custom-file-upload">
                            Choose Photo
                        </label>
                    </div>


                    <button className="subtn" type="submit">Register Employee</button>
                    <button type="button" className="back-button" onClick={() => navigate(-1)}>Back</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
