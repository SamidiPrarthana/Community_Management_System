import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';  // Use named import
import axios from 'axios';
import '../../Css/Rasindu/AttendanceForm.css'; // Create styling if needed

const QrScan = () => {
  const [scannedId, setScannedId] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const navigate = useNavigate();

  const handleResult = async (result) => {
    if (result && result.text && !scannedId) {
      try {
        const parsed = JSON.parse(result.text);
        const empId = parsed.employeeId;

        const now = new Date();

        if (checkInDone && checkInTime && (now - checkInTime) < 30000) {
          setMessage("Please wait at least 30 seconds before check-out.");
          setSuccess(false);
          return;
        }

        setScannedId(empId);
        const res = await axios.post("http://localhost:8070/attendance/mark", { empId });

        setMessage(res.data.message);
        setSuccess(true);

        if (res.data.message === 'Check-in successful') {
          setCheckInDone(true);
          setCheckInTime(now);
        } else if (res.data.message === 'Check-out successful') {
          setCheckInDone(false);
          setCheckInTime(null);
        }

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

  return (
    <div className="qr-scan-containerRa">
      <button onClick={() => navigate(-1)} className="qr-scan-back-btnRa">&larr; Back</button>
      <h2>Scan Employee QR Code</h2>

      <div className="qr-scannerRa">
        {isCameraActive && (
          <QrReader
            delay={300}
            onError={handleError}
            onResult={handleResult}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        )}
        <div className="scan-lineRa"></div>
      </div>

      {message && (
        <div className={`qr-scan-messageRa ${success ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QrScan;
