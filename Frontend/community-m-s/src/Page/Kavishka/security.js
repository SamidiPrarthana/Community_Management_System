import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import moment from 'moment';

const VehicleQRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [allocatedSlot, setAllocatedSlot] = useState(null);
    const scannerId = "qr-reader";

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(scannerId);
        let isScannerRunning = false;

        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    const cameraId = devices[0].id;

                    html5QrCode.start(
                        cameraId,
                        { fps: 10, qrbox: 250 },
                        (decodedText) => {
                            try {
                                const parsed = JSON.parse(decodedText);
                                setScanResult(parsed);
                                fetchDepartureAndAllocate(parsed);
                                html5QrCode.stop().then(() => {
                                    isScannerRunning = false;
                                }).catch(console.error);
                            } catch (err) {
                                setError("❌ Invalid QR Code format.");
                                console.error("QR Parse Error:", err);
                            }
                        },
                        (err) => { /* scan errors ignored */ }
                    ).then(() => {
                        isScannerRunning = true;
                    }).catch(err => {
                        setError("❌ Failed to start scanner: " + err);
                    });
                }
            })
            .catch(err => {
                setError("❌ Camera access error: " + err);
            });

        return () => {
            if (isScannerRunning) {
                html5QrCode.stop().catch(() => { });
            }
        };
    }, []);

    // Fetch and Auto Allocate
    const fetchDepartureAndAllocate = async (vehicleData) => {
        try {
            console.log('Fetching departure time...');
            const res = await axios.get('http://localhost:8070/api/leavetime/latest');
            const { departureTimes } = res.data;

            const tomorrowIndex = (new Date().getDay() + 1) % 7;
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const tomorrow = weekdays[tomorrowIndex];

            const time = departureTimes[tomorrow];
            if (!time) {
                setDepartureTime("❌ No time set for tomorrow.");
                return;
            }

            setDepartureTime(time);

            // Auto allocate slot
            const payload = {
                vehicleNumber: vehicleData.vehicleNumber,
                vehicleType: vehicleData.vehicleType,
                leavingTime: time, // Ensure time format is HH:mm
                entryTime: moment().format('YYYY-MM-DD HH:mm'),
            };
            console.log('Sending allocation payload:', payload);

            const allocateRes = await axios.post('http://localhost:8070/api/allocate_slot', payload);
            const slot = typeof allocateRes.data === 'object' && allocateRes.data.slot ? allocateRes.data.slot : allocateRes.data;
            setAllocatedSlot(slot);
            console.log('Allocation successful, slot:', slot);
        } catch (err) {
            console.error("Auto Allocation Error:", err.response?.data?.error || err.message);
            setError("❌ Failed to allocate parking slot: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="scanner-gate-display-k1">
            <h2>🚘 Scan Vehicle QR Code</h2>
            <div id={scannerId}></div>

            {error && <div className="error-message">{error}</div>}

            {scanResult && (
                <div className="gate-display-box">
                    <p className="gate-name">{scanResult.name}</p>
                    <p className="gate-vehicle">{scanResult.vehicleNumber}</p>
                    <p className="gate-type">{scanResult.vehicleType}</p>
                    <hr />
                    <p className="gate-departure">
                        🕒 Departure Time Tomorrow: <strong>{departureTime}</strong>
                    </p>
                    {allocatedSlot && (
                        <p className="gate-slot">
                            ✅ Allocated Slot: <strong style={{ color: "#0f0", fontSize: "30px" }}>{allocatedSlot}</strong>
                        </p>
                    )}
                </div>
            )}

            <style>{`
                .scanner-gate-display-k1 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    background: #111;
                    height: 100vh;
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                #qr-reader {
                    width: 320px;
                    margin: 20px auto;
                    border-radius: 12px;
                    padding: 12px;
                    background: #222;
                }

                .error-message {
                    color: #ff4d4f;
                    background: #2c2c2c;
                    padding: 12px 20px;
                    margin-top: 10px;
                    border-radius: 8px;
                    font-weight: 500;
                    text-align: center;
                }

                .gate-display-box {
                    margin-top: 30px;
                    background-color: #000;
                    border: 2px solid #0f0;
                    border-radius: 12px;
                    padding: 30px 40px;
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 0 20px #0f0;
                }

                .gate-display-box p {
                    margin: 10px 0;
                }

                .gate-name {
                    font-size: 42px;
                    font-weight: bold;
                    color: #0ff;
                }

                .gate-vehicle {
                    font-size: 38px;
                    font-weight: 600;
                    color: #0f0;
                }

                .gate-type {
                    font-size: 30px;
                    font-weight: 500;
                    color: #fff;
                }

                .gate-departure {
                    font-size: 24px;
                    font-weight: 500;
                    color: #ffd700;
                }

                .gate-slot {
                    font-size: 26px;
                    font-weight: 700;
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default VehicleQRScanner;