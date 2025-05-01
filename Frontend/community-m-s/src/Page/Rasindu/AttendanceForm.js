import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';  // Use named import
import axios from 'axios';
import '../../Css/Rasindu/AttendanceForm.css'; // Create styling if needed

const QrScan = () => {
  const [scannedId, setScannedId] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false); // Track if check-in was done
  const [checkInTime, setCheckInTime] = useState(null); // Store check-in time for delay validation
  const [isCameraActive, setIsCameraActive] = useState(true); // Camera active state
  const navigate = useNavigate();

  const handleResult = async (result) => {
    if (result && result.text && !scannedId) {
      try {
        const parsed = JSON.parse(result.text);
        const empId = parsed.employeeId;

        setScannedId(empId); // Prevent double scans
        const res = await axios.post("http://localhost:8070/attendance/mark", { empId });

        setMessage(res.data.message);
        setSuccess(true);

        // Set check-in time when check-in is done
        if (res.data.message === 'Check-in successful') {
          setCheckInDone(true);
          setCheckInTime(new Date());
        }

        // Optionally reset scanner after delay
        setTimeout(() => {
          setScannedId('');
          setMessage('');
        }, 5000);
      } catch (err) {
        setMessage("Invalid QR or Attendance Error");
        setSuccess(false);
        console.error(err);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    setMessage("Camera Error");
    setSuccess(false);
  };

  const handleCheckOut = async () => {
    const currentTime = new Date();

    // Check if 30 seconds have passed since check-in
    if (checkInTime && (currentTime - checkInTime) >= 30000) {
      try {
        const res = await axios.post("http://localhost:8070/attendance/mark", { empId: scannedId });
        setMessage(res.data.message);
        setSuccess(true);
        setCheckInDone(false);
        setCheckInTime(null); // Reset check-in time after successful check-out
      } catch (err) {
        setMessage("Error during check-out.");
        setSuccess(false);
      }
    } else {
      setMessage("You need to wait 30 seconds after check-in before checking out.");
      setSuccess(false);
    }
  };

  const handleCameraReset = () => {
    setIsCameraActive(true); // Reset camera for next scan
    setCheckInDone(false); // Reset check-in status
  };

  return (
    <div className="qr-scan-container">
      <button onClick={() => navigate(-1)} className="qr-scan-back-btn">&larr; Back</button>
      <h2>Scan Employee QR Code</h2>

      <div className="qr-scanner">
        {isCameraActive && (
          <QrReader
            delay={300}
            onError={handleError}
            onResult={handleResult}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        )}
        <div className="scan-line"></div>
      </div>

      {message && (
        <div className={`qr-scan-message ${success ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {checkInDone && (
        <div>
          <p>Check-in successful! Please wait for 30 seconds before checking out.</p>
          <button onClick={handleCheckOut} className="check-out-btn">
            Scan for Check-out
          </button>
        </div>
      )}
    </div>
  );
};

export default QrScan;
