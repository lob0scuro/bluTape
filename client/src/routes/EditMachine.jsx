import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./EditMachine.module.css";

const EditMachine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [machine, setMachine] = useState({});
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");

  const [edit, setEdit] = useState({
    make: false,
    model: false,
    serial: false,
    color: false,
    type: false,
  });

  useEffect(() => {
    fetch(`/api/get_machine/${id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachine(data.machine);
        setMake(data.machine.make);
        setModel(data.machine.model);
        setSerial(data.machine.serial);
        setColor(data.machine.color);
        setType(data.machine.style);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const toggleEditor = (field, isChecked) => {
    if (field === "all") {
      const allEnabled = Object.keys(edit).reduce((acc, key) => {
        acc[key] = isChecked;
        return acc;
      }, {});
      setEdit(allEnabled);
    } else {
      setEdit((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let result = confirm("Confirm Edit?");
    if (result) {
      fetch(`/api/update_machine/${id}`, {
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
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
          if (machine.in_progress) {
            navigate("/active-repairs");
          } else {
            navigate("/inventory-list");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      return;
    }
  };

  return (
    <>
      <h1 className={styles.editHeader}>
        Edit <br />
        {machine.make} <br /> <small>{machine.style}</small>
      </h1>
      <div className="button-block-inline">
        <Link to={`/repair-card/${machine.id}`}>View Notes</Link>
      </div>
      <form className={styles.editMachineForm} onSubmit={handleSubmit}>
        <div className="check-all">
          <label htmlFor="all">
            <input
              type="checkbox"
              name="all"
              id="all"
              onChange={(e) => toggleEditor("all", e.target.checked)}
            />
            edit all
          </label>
        </div>
        <div>
          <label htmlFor="make">
            Make:&nbsp;
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              disabled={!edit.make}
            />
            <input
              type="checkbox"
              name="editMake"
              id="editMake"
              checked={edit.make}
              onChange={() => toggleEditor("make")}
            />
            <small>edit</small>
          </label>
        </div>
        <div>
          <label htmlFor="model">
            Model:&nbsp;
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!edit.model}
            />
            <input
              type="checkbox"
              name="editModel"
              id="editModel"
              checked={edit.model}
              onChange={() => toggleEditor("model")}
            />
            <small>edit</small>
          </label>
        </div>
        <div>
          <label htmlFor="serial">
            Serial:&nbsp;
            <input
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              disabled={!edit.serial}
            />
            <input
              type="checkbox"
              name="editSerial"
              id="editSerial"
              checked={edit.serial}
              onChange={() => toggleEditor("serial")}
            />
            <small>edit</small>
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
              disabled={!edit.color}
            >
              <option value="null">Select...</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="stainless">Stainless</option>
              <option value="black-stainless">Black Stainless</option>
              <option value="other">Other</option>
            </select>
            <input
              type="checkbox"
              name="editColor"
              id="editColor"
              checked={edit.color}
              onChange={() => toggleEditor("color")}
            />
            <small>edit</small>
          </label>
        </div>
        <div>
          <label htmlFor="type">
            Style:&nbsp;
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!edit.type}
            >
              <option value="null">Select...</option>
              <option value="Top & Bottom">Top and Bottom</option>
              <option value="Side by Side">Side by Side</option>
              <option value="French Door">French Door</option>
              <option value="Freezer">Freezer</option>
              <option value="Bottom Top">Bottom Top</option>
              <option value="other">Other</option>
            </select>
            <input
              type="checkbox"
              name="editType"
              id="editType"
              checked={edit.type}
              onChange={() => toggleEditor("type")}
            />
            <small>edit</small>
          </label>
        </div>

        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default EditMachine;
