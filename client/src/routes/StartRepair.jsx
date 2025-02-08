import styles from "./StartRepair.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StartRepair = () => {
  const navigate = useNavigate();

  const [formInputs, setFormInputs] = useState(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const assurance = confirm("Confirm repair?");
    if (!assurance) {
      return;
    }
    const formData = {
      make,
      model,
      serial,
      type,
      color,
      note,
    };
    fetch("/api/create_machine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make: make,
        model: model,
        serial: serial,
        color: color,
        style: type,
        note: note,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        navigate(`/repair-card/${data.machine.id}`);
        alert(data.message);
      })
      .catch((error) => {
        console.error("There was an error brother", error);
      });
    setFormInputs(formData);
    setMake("");
    setModel("");
    setSerial("");
    setType("");
    setColor("");
    setNote("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.startRepairForm}>
        <h2>Start Repair</h2>
        <div>
          <label htmlFor="make">
            Make:&nbsp;
            <input
              type="text"
              name="make"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="model">
            Model:&nbsp;
            <input
              type="text"
              name="model"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="serial">
            Serial:&nbsp;
            <input
              type="text"
              name="serial"
              id="serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="color">
            Color:&nbsp;
            <select
              name="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="null">Select...</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="stainless">Stainless</option>
              <option value="black-stainless">Black Stainless</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="style">
            Style:&nbsp;
            <select
              name="style"
              id="style"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="null">Select...</option>
              <option value="Top & Bottom">Top and Bottom</option>
              <option value="Side by Side">Side by Side</option>
              <option value="French Door">French Door</option>
              <option value="Freezer">Freezer</option>
              <option value="Bottom Top">Bottom Top</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="note">
            Note
            <br />
            <textarea
              name="note"
              id="note"
              cols="45"
              rows="10"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </>
  );
};

export default StartRepair;
