import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Css/Rasindu/SalaryReport.css";

const MonthlySalaryReport = () => {
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;

  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  useEffect(() => {
    const fetchEmployeeReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8070/salary/monthlysal/${selectedYear}/${selectedMonth}`
        );
        setSalaryData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load salary details");
        setLoading(false);
      }
    };

    fetchEmployeeReport();
  }, [selectedYear, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-LK", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

      <select value={selectedMonth} onChange={handleMonthChange}>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>

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
