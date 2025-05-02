import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../Css/Rasindu/EmployeeListPage.css";

const EmployeeListPageLRa = () => {
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
    <div className="employee-list-containerLRa">
      <div className="employee-list-contentLRa">
        <h2 className="employee-headingLRa">Employee List</h2>

        <div className="employee-buttons-containerLRa">
          <button className="employee-buttonLRa add-buttonLRa" onClick={() => navigate("/empform")}>
            ADD Employee
          </button>
          <button className="employee-buttonLRa nav-buttonLRa" onClick={() => navigate('/empdashboard')}>
            Dashboard
          </button>
        </div>

        <table className="employee-tableLRa">
          <thead>
            <tr>
              <th className="employee-th-tdLRa employee-thLRa">Name</th>
              <th className="employee-th-tdLRa employee-thLRa">Email</th>
              <th className="employee-th-tdLRa employee-thLRa">Role</th>
              <th className="employee-th-tdLRa employee-thLRa">Hourly Rate</th>
              <th className="employee-th-tdLRa employee-thLRa">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="employee-th-tdLRa">{employee.name}</td>
                <td className="employee-th-tdLRa">{employee.email}</td>
                <td className="employee-th-tdLRa">{employee.role}</td>
                <td className="employee-th-tdLRa">{employee.hourlyRate}</td>
                <td className="employee-th-tdLRa">
                  <button className="employee-buttonLRa view-buttonLRa" onClick={() => navigate(`/employeeProfile/${employee._id}`)}>View</button>
                  <button className="employee-buttonLRa edit-buttonLRa" onClick={() => navigate(`/edit_employee/${employee._id}`)}>Edit</button>
                  <button className="employee-buttonLRa delete-buttonLRa" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                  <button className="employee-buttonLRa report-buttonLRa" onClick={() => navigate(`/employee-salary-report/${employee.employeeId}`)}>Salary Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeListPageLRa;
