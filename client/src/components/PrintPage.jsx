import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "../assets/images/matts-logo.png";

const PrintPage = (props) => {
  const url = `https://blutape.net/repair-card/${props.machine.id}`;
  //label is 2in x 4in
  // converted to pixels = 192px x 384px

  return (
    <>
      <div>
        <QRCodeSVG
          value={url}
          size={300}
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
