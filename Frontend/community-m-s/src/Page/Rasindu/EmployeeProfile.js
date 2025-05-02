// src/components/Rasindu/EmployeeProfile.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faHome,
  faBriefcase,
  faMoneyBillWave,
  faIdBadge,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import '../../Css/Rasindu/EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState(false);
  const qrRef = useRef();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/employee/${id}`);
        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load employee details');
        setLoading(false);
        console.error('Error fetching employee:', err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleImageError = () => {
    setPhotoError(true);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${employee.name}_QRCode.png`;
      a.click();
    }
  };

  if (loading) return <div className="loading-container">Loading employee details...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!employee) return <div className="not-found">Employee not found</div>;

  const qrData = JSON.stringify({
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    contact: employee.contact,
    address: employee.address,
    role: employee.role,
    hourlyRate: employee.hourlyRate
  });

  return (
    <div className="employee-profile-container dark-theme">
      <div className="profile-header">
        <h1>Employee Profile</h1>
        <div className="employee-id-badge">
          <FontAwesomeIcon icon={faIdBadge} />
          <span>{employee.employeeId}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-left-section">
          <div className="profile-photo-container">
            {employee.photo && !photoError ? (
              <img
                src={employee.photo}
                alt={`${employee.name}'s profile`}
                className="profile-photo"
                onError={handleImageError}
              />
            ) : (
              <div className="profile-photo-placeholder">
                <FontAwesomeIcon icon={faUser} size="3x" />
              </div>
            )}
          </div>

          <div className="basic-info-card">
            <h2 className="employee-name">{employee.name}</h2>
            <p className="employee-role">{employee.role}</p>
            <div className="hourly-rate-display">
              <FontAwesomeIcon icon={faMoneyBillWave} />
              <span>Hourly Rate: Rs. {employee.hourlyRate.toFixed(2)}</span>
            </div>
          </div>

          <div className="qr-code-section">
            <h3>Employee QR Code</h3>
            <div ref={qrRef} className="qr-code-wrapper">
              <QRCodeCanvas
                value={qrData}
                size={180}
                bgColor={"#ffffff"}  // White background
                fgColor={"#000000"}  // Black foreground
                level={"H"}
                includeMargin={true}
              />
            </div>
            <button className="download-btn" onClick={downloadQRCode}>
              <FontAwesomeIcon icon={faDownload} /> Download QR Code
            </button>
          </div>
        </div>

        <div className="profile-right-section">
          <div className="detail-card">
            <h3 className="detail-card-header">
              <FontAwesomeIcon icon={faUser} />
              <span>Personal Information</span>
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{employee.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Employee ID</span>
                <span className="detail-value">{employee.employeeId}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-header">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Contact Information</span>
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">
                  <a href={`mailto:${employee.email}`}>{employee.email}</a>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">
                  <a href={`tel:${employee.contact}`}>{employee.contact}</a>
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-header">
              <FontAwesomeIcon icon={faHome} />
              <span>Address Information</span>
            </h3>
            <div className="detail-item full-width">
              <span className="detail-label">Residential Address</span>
              <span className="detail-value address-value">{employee.address}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-header">
              <FontAwesomeIcon icon={faBriefcase} />
              <span>Employment Details</span>
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Position</span>
                <span className="detail-value">{employee.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hourly Rate</span>
                <span className="detail-value">Rs. {employee.hourlyRate.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;