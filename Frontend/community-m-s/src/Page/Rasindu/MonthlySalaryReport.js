import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Css/Rasindu/SalaryReport.css";

const MonthlySalaryReport = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get("http://localhost:8070/salary/monthlysal");
        const formattedData = response.data.map(item => ({
          ...item,
          totalHours: item.totalHours.toFixed(2),
          monthlySalary: item.monthlySalary.toFixed(2),
          hourlyRate: item.hourlyRate.toFixed(2)
        }));
        setSalaryData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load salary data. Please try again later.");
        setLoading(false);
        console.error("Error fetching salary data:", err);
      }
    };

    fetchSalaryData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="salary-report-container">
        <div className="loading-spinner">Loading salary data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salary-report-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="salary-report-container">
      <h2 className="salary-heading">Monthly Salary Report</h2>
      <table className="salary-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Hourly Rate (LKR)</th>
            <th>Total Hours</th>
            <th>Monthly Salary (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {salaryData.map((emp, index) => (
            <tr key={index}>
              <td>{emp.employeeId}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{formatCurrency(emp.hourlyRate)}</td>
              <td>{emp.totalHours}</td>
              <td>{formatCurrency(emp.monthlySalary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlySalaryReport;
