import React, { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(10);
    const [totalSalary, setTotalSalary] = useState("$50,000");
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null);

    useEffect(() => {
        const fetchEmployeeCount = async () => {
            try {
                const response = await axios.get("http://localhost:8070/employee");
                setTotalEmployees(response.data.length);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchEmployeeCount();
    }, []);

    const styles = {
        container: { display: "flex", height: "100vh" ,backgroundColor: " rgba(0, 0, 0, 0.832)",width:"100%"},
        sidebar: { width: "250px", background: "#1f2937", color: "white", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
        sidebarTitle: { fontSize: "22px",color:"#ff5656", fontWeight: "bold", marginBottom: "20px" },
        menu: { listStyle: "none", padding: 0, marginTop: "100px"},
        menuItem: (isHovered) => ({
            padding: "12px", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", borderRadius: "5px", transition: "0.3s", marginTop: "30px", background: isHovered ? "#374151" : "transparent", border: "none", color: "#f4f4f4", fontSize: "25px"
        }),
        logoutButton: { background: "#dc2626", color: "white", border: "none", padding: "10px", fontSize: "16px", borderRadius: "5px", cursor: "pointer", transition: "0.3s", width: "100%" },
        main: { flex: 1, padding: "20px" },
        heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px",color:"white" },
        cardGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
        card: { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center" },
        iconBlue: { fontSize: "40px", color: "#3b82f6", marginBottom: "10px" },
        iconGreen: { fontSize: "40px", color: "#10b981", marginBottom: "10px" },
        iconYellow: { fontSize: "40px", color: "#f59e0b", marginBottom: "10px" }
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div>
                    <h2 style={styles.sidebarTitle}>HI, Rasindu...</h2>
                    <ul style={styles.menu}>
                        {['/', '/employees', '/monthlysalaryreport', '/attend'].map((path, index) => (
                            <li key={index}>
                                <button
                                    style={styles.menuItem(hoveredButton === index)}
                                    onMouseEnter={() => setHoveredButton(index)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => navigate(path)}
                                >
                                    {['Home', 'Employees', 'Salary', 'Attendanace'][index]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button style={styles.logoutButton} onClick={() => navigate("/maindashboard/")}>
                    <FiLogOut /> BACK
                </button>
            </aside>

            <main style={styles.main}>
                <h1 style={styles.heading}>Dashboard</h1>
                <div style={styles.cardGrid}>
                    <div style={styles.card}>
                        <FiUsers style={styles.iconBlue} />
                        <h2>Total Employees</h2>
                        <p>{totalEmployees}</p>
                    </div>
                    
                    <div style={styles.card}>
                        <FiDollarSign style={styles.iconYellow} />
                        <h2>Total Salary</h2>
                        <p>{totalSalary}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
