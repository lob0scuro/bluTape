import styles from "./StartRepair.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const brands = {
  Admiral: "Admiral",
  Amana: "Amana",
  Avanti: "Avanti",
  Bosch: "Bosch",
  Crosley: "Crosley",
  Cuisinart: "Cuisinart",
  Danby: "Danby",
  Fridgidaire: "Fridgidaire",
  GE: "GE",
  Haier: "Haier",
  Hotpoint: "Hotpoint",
  Kenmore: "Kenmore",
  Kitchenaid: "Kitchenaid",
  LG: "LG",
  Maytag: "Maytag",
  Roper: "Roper",
  Samsung: "Samsung",
  Whirlpool: "Whirlpool",
};

const StartRepair = () => {
  const navigate = useNavigate();

  const [formInputs, setFormInputs] = useState(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [note, setNote] = useState("");
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 8000);
    }
  }, [error]);

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
      condition,
    };
    fetch("/api/create_machine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        alert(data.message);
        navigate(`/repair-card/${data.machine.id}`);
      })
      .catch((error) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        console.error("Error: ", error);
        setError(error.message);
      });
    setFormInputs(formData);
    setMake("");
    setModel("");
    setSerial("");
    setType("");
    setColor("");
    setNote("");
    setCondition("");
  };

  const renderSelect = Object.entries(brands).map(([key, value]) => (
    <option key={key} value={key}>
      {value}
    </option>
  ));

  return (
    <>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className={styles.startRepairForm}>
        <h2>Start Repair</h2>
        <div>
          <label htmlFor="make">Brand:</label>
          <select
            name="make"
            id="make"
            onChange={(e) => setMake(e.target.value)}
          >
            <option value="">Select...</option>
            {renderSelect}
          </select>
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
              name="type"
              id="type"
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
          <label htmlFor="condition">
            Condition:&nbsp;
            <select
              name="condition"
              id="condition"
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="null">Select...</option>
              <option value="USED">Used</option>
              <option value="NEW">New</option>
            </select>
          </label>
        </div>
        <div className={styles.textArea}>
          <label htmlFor="note">Note</label>
          <br />
          <textarea
            name="note"
            id="note"
            cols="45"
            rows="10"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </>
  );
};

export default StartRepair;
