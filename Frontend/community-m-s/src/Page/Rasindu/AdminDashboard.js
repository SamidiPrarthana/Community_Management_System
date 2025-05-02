import React, { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css/Rasindu/AdminDashboard.css";

export default function AdminDashboard() {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalSalary, setTotalSalary] = useState("Rs.0.00");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeCount = async () => {
            try {
                const response = await axios.get("http://localhost:8070/employee");
                setTotalEmployees(response.data.length);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        const fetchTotalSalary = async () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            try {
                const response = await axios.get(`http://localhost:8070/salary/monthlysal/${year}/${month}`);
                const salaryData = response.data;
                const total = salaryData.reduce((sum, emp) => sum + emp.monthlySalary, 0);
                setTotalSalary(`$${total.toFixed(2)}`);
            } catch (error) {
                console.error("Error fetching total salary:", error);
            }
        };

        fetchEmployeeCount();
        fetchTotalSalary();
    }, []);

    return (
        <div className="admin-dashboard-containerRa">
            <aside className="admin-sidebarRa">
                <div>
                    <h2 className="sidebar-titleRa">HI, Rasindu...</h2>
                    <ul className="sidebar-menuRa">
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/")}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/employees")}>
                                Employees
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/monthlysalaryreport")}>
                                Salary
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/attend")}>
                                Attendance
                            </button>
                        </li>
                    </ul>
                </div>
                <button className="logout-buttonRa" onClick={() => navigate("/maindashboard/")}>
                    <FiLogOut /> BACK
                </button>
            </aside>

            <main className="admin-main-contentRa">
                <h1 className="dashboard-headingRa">Dashboard</h1>
                <div className="card-gridRa">
                    <div className="dashboard-cardRa">
                        <FiUsers className="icon-blueRa" />
                        <h2>Total Employees</h2>
                        <p className="card-valueRa">{totalEmployees}</p>
                    </div>

                    <div className="dashboard-cardRa">
                        <FiDollarSign className="icon-yellowRa" />
                        <h2>Total Salary</h2>
                        <p className="card-valueRa">{totalSalary}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
