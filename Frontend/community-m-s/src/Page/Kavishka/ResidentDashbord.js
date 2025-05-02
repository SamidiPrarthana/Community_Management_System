import React from "react";
import { Link } from "react-router-dom";
import backgroundImg from "../../image/image1.jpg";
import Navbar from "../NavBar";
import Footer from "../Footer";

// Common style
const containerStyle = {
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
};

const buttonStyle = {
    display: "block",
    width: "200px",
    margin: "10px",
    padding: "10px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
};

const profileButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#28a745",
};

// Layout wrapper
const PageLayout = ({ children }) => (
    <>
        <Navbar />
        <div style={containerStyle}>{children}</div>
        <Footer />
    </>
);

// Final App Component (With User Name and Links)
const App = () => {
    const userName = localStorage.getItem("userName"); // ✅ Get the name

    return (
        <PageLayout>
            <h1>Creative Apartment Management</h1>
            {userName && <h2>Welcome, {userName} 👋</h2>} {/* ✅ Show name if available */}

            <nav>
                <Link to="/apartmentForm"><button style={buttonStyle}>Apply Apartment</button></Link>
                <Link to="/visitor"><button style={buttonStyle}>Visitor Registration</button></Link>
                <Link to="/vehicleRegisterForm"><button style={buttonStyle}>Parking Registration</button></Link>
                <Link to="/profile"><button style={profileButtonStyle}>User Profile</button></Link>
                <Link to="/user"><button style={buttonStyle}>userlist</button></Link>
                <Link to="/security"><button style={buttonStyle}>SecurityDashbord</button></Link>
                <Link to="/demoparking"><button style={buttonStyle}>Demoparking</button></Link>
                <Link to="/leave"><button style={buttonStyle}>LeaveTime</button></Link>
                <Link to="/slotMap"><button style={buttonStyle}>SlotMap</button></Link>

            </nav>
        </PageLayout>
    );
};

export default App;
