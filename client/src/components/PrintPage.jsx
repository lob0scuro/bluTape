import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "../assets/images/matts-logo.png";

const PrintPage = (props) => {
  const url = `http://192.168.1.113:5173/repair-card/${props.machine.id}`;

  return (
    <>
      <div>
        <QRCodeSVG
          value={url}
          size={230}
          imageSettings={{ src: logo, height: 100, width: 100 }}
        />
      </div>
      <div>
        <p>
          <b>ID:</b> {props.machine.id}
        </p>
        <p>
          <b>Manufacturer:</b> {props.machine.make}
        </p>
        <p>
          <b>Model No:</b> {props.machine.model}
        </p>
        <p>
          <b>Serial No:</b> {props.machine.serial}
        </p>
        <p>
          <b>Style:</b> {props.machine.style}
        </p>
      </div>
    </>
  );
};

export default PrintPage;
