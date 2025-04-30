import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../Css/Rasindu/EmployeeListPage.css";


const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get("http://localhost:8070/employee")
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the employee data:", error);
      });
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios.delete(`http://localhost:8070/employee/delete/${id}`)
        .then(response => {
          alert(response.data.message);
          setEmployees(employees.filter(emp => emp._id !== id));
        })
        .catch(error => {
          console.error("Error deleting employee:", error);
          alert("Failed to delete the employee.");
        });
    }
  };

  

  return (
    <div className="employee-list-container">
      <div className="employee-list-content">
        <h2 className="employee-heading">Employee List</h2>
        
        <div className="employee-buttons-container">
          <button className="employee-button add-button" onClick={() => navigate("/empform")}>
            ADD Employee
          </button>
          <button className="employee-button nav-button" onClick={() => navigate('/empdashboard')}>
            Dashboard
          </button>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th className="employee-th-td employee-th">Name</th>
              <th className="employee-th-td employee-th">Email</th>
              <th className="employee-th-td employee-th">Role</th>
              <th className="employee-th-td employee-th">Hourly Rate</th>
              
              <th className="employee-th-td employee-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="employee-th-td">{employee.name}</td>
                <td className="employee-th-td">{employee.email}</td>
                <td className="employee-th-td">{employee.role}</td>
                <td className="employee-th-td">{employee.hourlyRate}</td>
               
                <td className="employee-th-td">
                  <button className="employee-button view-button" onClick={() => navigate(`/employeeProfile/${employee._id}`)}>View</button>
                  <button className="employee-button edit-button" onClick={() => navigate(`/edit_employee/${employee._id}`)}>Edit</button>
                  <button className="employee-button delete-button" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                  <button className="employee-button report-button"onClick={() => navigate(`/employee-salary-report/${employee.employeeId}`)}>Salary Report</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default EmployeeListPage;
