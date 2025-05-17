import React, { useRef } from "react";
import "./QRpage.css";
import { QRCodeSVG } from "qrcode.react";

const QRpage = () => {
  const value = `http://localhost:5000/api/vehicles/number/${localStorage.getItem("vehId")}`;
  const svgRef = useRef(null);
  const downloadQR = () => {
    const svg = svgRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const link = document.createElement("a");
      link.href = imgURI;
      link.download = `qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = url;
  };

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

      <div className="QR-code" ref={svgRef}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <QRCodeSVG value={value} size={200} />
        </div>
      </div>

      <div className="QR-footer">
        <button className="blue">Send QR to My Mobile</button>
        <button onClick={downloadQR} className="green">Download QR</button>
      </div>
    </div>
  );
};

export default QRpage;
