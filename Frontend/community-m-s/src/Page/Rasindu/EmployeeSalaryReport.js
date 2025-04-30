import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../Css/Rasindu/EmpSalaryReport.css";

const EmployeeSalaryReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeReport = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/salary/employee/${employeeId}`);
        setReportData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load salary report");
        setLoading(false);
      }
    };

    fetchEmployeeReport();
  }, [employeeId]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="salary-report-container">
        <div className="loading-spinner">Loading salary report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salary-report-container">
        <div className="error-message">{error}</div>
        <button 
          className="attendance-back-button"
          onClick={() => navigate(-1)}
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="salary-report-container">
      <button 
        className="attendance-back-button"
        onClick={() => navigate(-1)}
      >
        &larr; Go Back
      </button>
      
      <h2 className="salary-heading">Employee Salary Report</h2>
      
      <div className="employee-salary-card">
        <div className="employee-info">
          <h3>{reportData.name}</h3>
          <p><strong>Employee ID:</strong> {reportData.employeeId}</p>
          <p><strong>Role:</strong> {reportData.role}</p>
        </div>
        
        <div className="salary-details">
          <div className="detail-row">
            <span>Hourly Rate:</span>
            <span>{formatCurrency(reportData.hourlyRate)} LKR</span>
          </div>
          <div className="detail-row">
            <span>Total Hours Worked:</span>
            <span>{reportData.totalHours} hours</span>
          </div>
          <div className="detail-row total-salary">
            <span>Monthly Salary:</span>
            <span>{formatCurrency(reportData.monthlySalary)} LKR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryReport;