// File: src/components/AttendanceForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Css/Rasindu/AttendanceForm.css';

const AttendanceForm = () => {
  const [empId, setEmpId] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Log the empId to check if it's correctly passed
      console.log("Submitted empId:", empId);
      
      const res = await axios.post("http://localhost:8070/attendance/mark", { empId });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error marking attendance");
      setIsSuccess(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <button onClick={handleBack} className="attendance-back-button">
          &larr; Back
        </button>
        <h2 className="attendance-title">Mark Your Attendance</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter EMP ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}  // Update empId on input change
            className="attendance-input"
            required
          />
          <button type="submit" className="attendance-button">
            Submit Attendance
          </button>
        </form>
        {message && (
          <div className={`attendance-message ${isSuccess ? 'success-message' : 'error-message'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceForm;
