import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserById = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found");
                    return;
                }

                // ✅ Correct usage
                const decoded = jwtDecode(token);
                const userId = decoded.id || decoded._id || decoded.userId;

                const response = await fetch(`http://localhost:8070/api/users/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUsers([data]); // Wrap in array if you're fetching a single user
                } else {
                    setError(data.error || "Failed to fetch user");
                }
            } catch (err) {
                setError("⚠️ Server error. Please try again later.");
            }
        };

        fetchUserById();
    }, []);

    return (
        <div>
            <h1>User List</h1>
            {error && <div className="error-message">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>User Type</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.userType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
