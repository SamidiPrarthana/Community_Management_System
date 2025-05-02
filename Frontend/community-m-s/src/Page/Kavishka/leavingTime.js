import { useState } from "react";
import axios from "axios";
import "../../Css/leavingTime.css";

export default function LeaveTimeForm() {
    const [departureTimes, setDepartureTimes] = useState({});
    const [availableDays, setAvailableDays] = useState([]);
    const [errors, setErrors] = useState({});

    const handleCheckboxChange = (day) => {
        setAvailableDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleTimeChange = (day, time) => {
        setDepartureTimes((prev) => ({ ...prev, [day]: time }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (availableDays.length === 0) {
            formErrors.availableDays = "At least one day must be selected.";
            isValid = false;
        }

        availableDays.forEach((day) => {
            if (!departureTimes[day]) {
                formErrors[day] = `Departure time for ${day} is required.`;
                isValid = false;
            }
        });

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:8070/api/leavetime/assign", {
                departureTimes,
                availableDays,
            });
            alert(response.data.message || "Leave times saved successfully!");
        } catch (error) {
            alert("Error saving leave times");
        }
    };

    return (
        <div className="body-k">
            <div className="form-container">
                <h2 className="form-title">Set Leave Times</h2>
                <form onSubmit={handleSubmit} className="form-content">
                    <div className="days-grid">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="day-container">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={availableDays.includes(day)}
                                        onChange={() => handleCheckboxChange(day)}
                                        className="checkbox"
                                    />
                                    <span>{day}</span>
                                </label>
                                {availableDays.includes(day) && (
                                    <>
                                        <input
                                            type="time"
                                            value={departureTimes[day] || ""}
                                            onChange={(e) => handleTimeChange(day, e.target.value)}
                                            className="time-input"
                                        />
                                        {errors[day] && <p className="error-message">{errors[day]}</p>}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.availableDays && <p className="error-message">{errors.availableDays}</p>}

                    <button type="submit" className="submit-button">
                        Save Leave Times
                    </button>
                </form>
            </div>
        </div>
    );
}
