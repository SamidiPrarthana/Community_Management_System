import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded; // return full user object (includes name, userId etc.)
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
};
