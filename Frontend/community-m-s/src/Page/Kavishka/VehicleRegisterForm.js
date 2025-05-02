import React, { useState, useEffect } from "react";
import "../../Css/vehicaleReg.css";

const VehicleRegisterForm = () => {
    const [vehicles, setVehicles] = useState([
        { vehicleNumber: "", vehicleType: "Car" }
    ]);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [qrCodeUrls, setQrCodeUrls] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const nameFromStorage = localStorage.getItem("userName");
        const idFromStorage = localStorage.getItem("userId");
        if (nameFromStorage && idFromStorage) {
            setUserName(nameFromStorage);
            setUserId(idFromStorage);
        }
    }, []);

    const handleVehicleChange = (index, field, value) => {
        const updatedVehicles = [...vehicles];
        updatedVehicles[index] = {
            ...updatedVehicles[index],
            [field]: value
        };
        setVehicles(updatedVehicles);
    };

    const addVehicle = () => {
        setVehicles([...vehicles, { vehicleNumber: "", vehicleType: "Car" }]);
    };

    const removeVehicle = (index) => {
        if (vehicles.length > 1) {
            const updatedVehicles = vehicles.filter((_, i) => i !== index);
            setVehicles(updatedVehicles);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");
        setQrCodeUrls([]);

        try {
            const registeredQrCodes = [];

            // Validate all vehicle numbers first
            for (const vehicle of vehicles) {
                if (!vehicle.vehicleNumber || !vehicle.vehicleNumber.trim()) {
                    setError("❌ All vehicle numbers must be filled");
                    return;
                }
            }

            // Register each vehicle one by one
            for (const vehicle of vehicles) {
                console.log("Registering vehicle:", vehicle); // Debug log

                // Create QR code data object with all the information
                const qrCodeData = {
                    residentId: userId,
                    name: userName,
                    vehicleNumber: vehicle.vehicleNumber,
                    vehicleType: vehicle.vehicleType,
                    timestamp: new Date().toISOString()
                };

                // Simulating QR code URL generation
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrCodeData))}`;

                registeredQrCodes.push({
                    qrCodeUrl,
                    vehicleNumber: vehicle.vehicleNumber,
                    vehicleType: vehicle.vehicleType
                });
            }

            setQrCodeUrls(registeredQrCodes);
            setSuccessMessage("✅ Vehicles registered successfully!");
        } catch (err) {
            setError("❌ Failed to register vehicles");
            console.error(err);
        }
    };

    const handleDownload = (url, vehicleNumber) => {
        fetch(url)
            .then((response) => response.blob()) // Convert the image to blob
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob); // Create an object URL for the blob
                link.download = `vehicle_qr_code_${vehicleNumber}.png`; // Specify the filename
                link.click(); // Trigger the download
            })
            .catch((err) => {
                console.error("Failed to download QR code:", err);
            });
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <div className="form-header">
                    <div className="form-icon">🚗</div>
                    <h2 className="form-title">Vehicle Registration</h2>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label>Resident Name</label>
                        <input
                            type="text"
                            value={userName}
                            className="input-readonly"
                            readOnly
                            placeholder="Name will appear here"
                            style={{ color: "black" }}
                        />
                    </div>

                    <input
                        type="hidden"
                        value={userId}
                    />

                    {vehicles.map((vehicle, index) => (
                        <div key={index} className="vehicle-entry">
                            <div className="vehicle-header">
                                <h3>Vehicle {index + 1}</h3>
                                {vehicles.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-vehicle-btn"
                                        onClick={() => removeVehicle(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Vehicle Number</label>
                                <input
                                    type="text"
                                    value={vehicle.vehicleNumber}
                                    onChange={(e) => handleVehicleChange(index, "vehicleNumber", e.target.value)}
                                    required
                                    placeholder="e.g., ABC-1234"
                                    className="form-input"
                                    autoComplete="off"
                                    style={{ color: "black" }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Vehicle Type</label>
                                <select
                                    value={vehicle.vehicleType}
                                    onChange={(e) => handleVehicleChange(index, "vehicleType", e.target.value)}
                                    required
                                    className="form-select"
                                >
                                    <option value="Car">Car</option>
                                    <option value="Motorbike">Motorbike</option>
                                    <option value="Van">Van</option>
                                    <option value="Three-Wheeler">Three-Wheeler</option>
                                    <option value="Bicycle">Bicycle</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <div className="button-group">
                        <button
                            type="button"
                            className="add-vehicle-button"
                            onClick={addVehicle}
                        >
                            + Add Another Vehicle
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Register Vehicles
                        </button>
                    </div>

                    {successMessage && (
                        <div className="success-message">{successMessage}</div>
                    )}

                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                </form>
            </div>

            <div className="qr-codes-container">
                {qrCodeUrls.map((qrCode, index) => (
                    <div key={index} className="qr-container">
                        <div className="qr-header">
                            <div className="qr-icon">🔒</div>
                            <h4 className="qr-title">Vehicle QR Code</h4>
                        </div>

                        <div className="qr-code-wrapper">
                            <img src={qrCode.qrCodeUrl} alt="QR Code" className="qr-image" />
                        </div>

                        <div className="qr-info">
                            <div className="info-item">
                                <span className="info-label">Vehicle:</span>
                                <span className="info-value">{qrCode.vehicleType}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Number:</span>
                                <span className="info-value">{qrCode.vehicleNumber}</span>
                            </div>
                        </div>

                        <button
                            className="download-button"
                            onClick={() => handleDownload(qrCode.qrCodeUrl, qrCode.vehicleNumber)}
                        >
                            Download QR Code
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehicleRegisterForm;
