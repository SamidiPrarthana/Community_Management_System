import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Use named import

const QRCodePage = () => {
  const link = "http://localhost:3000/attendance-form"; // Change to your frontend form link

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Scan to Mark Attendance</h1>
      <QRCodeCanvas value={link} size={256} />
    </div>
  );
};

export default QRCodePage;
