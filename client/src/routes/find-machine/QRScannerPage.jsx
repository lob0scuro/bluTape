import React, { useEffect, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useNavigate } from "react-router-dom";

const QRScannerPage = () => {
  const navigate = useNavigate();
  const [manualEntry, setManualEntry] = useState(false);
  const [machineId, setMachineId] = useState("");

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let streamRef;

    codeReader
      .decodeFromVideoDevice(null, "video", (result, err) => {
        if (result) {
          const id = result.getText().trim();
          console.log("Scanned QR ID:", id);

          // Only navigate with the ID, not a full URL
          navigate(`/card/${id}`);
        }
        if (err) {
          // Optional: console.warn(err);
        }
      })
      .then((stream) => {
        streamRef = stream; // keep reference to stop later
      })
      .catch((err) => console.error("QR reader failed:", err));

    return () => {
      // Stop camera when component unmounts
      if (streamRef && typeof streamRef.getTracks === "function") {
        streamRef.getTracks().forEach((track) => track.stop());
      }
    };
  }, [navigate]);

  const handleManualSubmit = () => {
    const id = machineId.trim();
    if (id) {
      navigate(`/card/${id}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <h3>Scan QR Code</h3>
      <video
        id="video"
        style={{ width: "100%", maxWidth: "200px", borderRadius: "8px" }}
      />
      <p style={{ margin: "1rem 0" }}>or</p>
      <p>Enter Machine ID Manually</p>
      <input
        type="text"
        name="machine_id"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        style={{
          width: "80px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "0.6rem",
          fontSize: "18px",
          textAlign: "center",
        }}
      />
      <button
        onClick={handleManualSubmit}
        style={{
          marginTop: "1rem",
          padding: "0.8rem 1.2rem",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default QRScannerPage;
