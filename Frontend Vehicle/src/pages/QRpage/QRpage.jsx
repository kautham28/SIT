import React from 'react';
import './QRpage.css';
// Remove the line importing from "../../assets/assets"

const QRpage = () => {
  return (
    <div className="QR-container">
      <h2>National Fuel Pass</h2>
      
      <div className="QR-details">
        <div>
          <strong>Eligible Weekly Quota:</strong> 0.000 L
        </div>
        <div>
          <strong>Balance Weekly Quota:</strong> 0.000 L
        </div>
      </div>
      
      <div className="QR-code">
        <img src='qr.avif' alt="QR Code" />
        <div>Code : 8UXD883KQN7P</div>
      </div>
      
      <div className="QR-footer">
        <button className="blue">Send QR to My Mobile</button>
        <button className="green">Download QR</button>
      </div>
    </div>
  );
}

export default QRpage;