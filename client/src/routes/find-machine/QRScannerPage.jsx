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
          console.log("Scanned QR:", result.getText());
          navigate(`/card/${result.getText()}`);
        }
        if (err) {
          // Optional: console.warn(err);
        }
      })
      .then((stream) => {
        streamRef = stream; // save the MediaStream so we can stop it later
      });

    return () => {
      // Stop all tracks when unmounting
      if (streamRef && typeof streamRef.getTracks === "function") {
        streamRef.getTracks().forEach((track) => track.stop());
      }
    };
  }, [navigate]);

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
      <br />
      <p>or</p>
      <br />
      <p>Enter Machine ID Manually</p>
      <input
        type="text"
        name="machine_id"
        id="machine_id"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        style={{
          width: "80px",
          borderRadius: "8px",
          border: "none",
          marginTop: "0.6rem",
          fontSize: "18px",
          textAlign: "center",
        }}
      />
      <button
        onClick={() => navigate(`/card/${machineId}`)}
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
