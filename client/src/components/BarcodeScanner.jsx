import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScanner = ({ onResult, onCancel }) => {
  const videoRef = useRef(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const codeReader = reader.current;

    codeReader.BrowserCodeReader.ListVideoInputDevices()
      .then((devices) => {
        const deviceId = devices[0]?.deviceId;
        codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              onResult(result.getText());
              codeReader.reset();
            }
          }
        );
      })
      .catch((err) => {
        console.error("Camera error: ", err);
      });
    return () => {
      codeReader.reset();
    };
  }, [onResult]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <video ref={videoRef} style={{ width: "100%", maxHeight: "300px" }} />
      <button
        type="button"
        onClick={() => {
          reader.current.reset();
          onCancel();
        }}
      >
        Cancel Scan
      </button>
    </div>
  );
};

export default BarcodeScanner;
