import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../../Css/Rasindu/EmpSalaryReport.css";

const EmployeeSalaryReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  useEffect(() => {
    const fetchEmployeeReport = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/salary/employee/${employeeId}/${selectedYear}/${selectedMonth}`);
        setReportData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load salary report");
        setLoading(false);
      }
    };

    fetchEmployeeReport();
  }, [employeeId, selectedYear, selectedMonth]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lineSpacing = 10;
    let y = 20;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Employee Salary Report", 70, y);
    y += lineSpacing + 5;
  
    // Add month/year line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const monthName = new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' });
    doc.text(`Month: ${monthName} ${selectedYear}`, 20, y);
    y += lineSpacing;
  
    // Employee Info Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Employee Information", 20, y);
    y += 6;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 6;
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Employee ID: ${reportData.employeeId}`, 25, y);
    y += lineSpacing;
    doc.text(`Name: ${reportData.name}`, 25, y);
    y += lineSpacing;
    doc.text(`Role: ${reportData.role}`, 25, y);
    y += lineSpacing + 4;
  
    // Salary Info Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Salary Details", 20, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 6;
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Hourly Rate: ${formatCurrency(reportData.hourlyRate)} LKR`, 25, y);
    y += lineSpacing;
    doc.text(`Total Hours Worked: ${reportData.totalHours} hours`, 25, y);
    y += lineSpacing;
  
    // Highlighted Salary
    doc.setFillColor(230, 230, 250); // Light lavender background
    doc.rect(20, y - 6, 170, 12, "F");
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Monthly Salary: ${formatCurrency(reportData.monthlySalary)} LKR`, 25, y + 3);
    y += lineSpacing + 4;
  
    // Save PDF
    doc.save(`Salary_Report_${reportData.employeeId}_${selectedMonth}_${selectedYear}.pdf`);
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

      <div className="month-selector">
        <select value={selectedYear} onChange={handleYearChange}>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          {/* Add more years as needed */}
        </select>
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
      </div>

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

      {/* PDF Download Button */}
      <button className="download-pdf-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default EmployeeSalaryReport;
