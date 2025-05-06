import styles from "../style/EditTech.module.css";
import React, { useEffect, useState } from "react";
import { renderMatches, useNavigate } from "react-router-dom";
import { fetchOneTech, fetchAllTechs, renderOptions } from "../utils";

const EditTech = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tech, setTech] = useState(null);
  const [allTechs, setAllTechs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getIt = async () => {
      const gotIt = await fetchAllTechs();
      setAllTechs(gotIt);
    };
    getIt();
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.target;
    const form_data = new FormData(form);
    if (file) {
      form_data.set("profile_pic", file);
    }
    try {
      const response = await fetch(`/auth/update_tech/${tech.id}`, {
        method: "PATCH",
        body: form_data,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      localStorage.setItem("loggedInUser", JSON.stringify(data.tech));
      setMessage(data.message);
      navigate("/");
    } catch (error) {
      setError("There was an error.");
    }
  };

  const renderTechOptions = allTechs.map((tech) => (
    <option key={tech.id} value={tech.id}>
      {tech.full_name}
    </option>
  ));

  const isolateTech = async (id) => {
    if (id === "") {
      setTech(null);
      return;
    }
    const theTech = await fetchOneTech(id);
    setTech(theTech);
  };

  return (
    <>
      <h1>Techs</h1>
      <div className={styles.selectBlock}>
        <select
          name="techs"
          id="techs"
          onChange={(e) => isolateTech(e.target.value)}
          className={styles.selectingTech}
        >
          <option value="">--Select Techinician</option>
          {renderTechOptions}
        </select>
        {tech && (
          <button onClick={() => setEditing(!editing)}>
            {editing ? "..." : "Edit"}
          </button>
        )}
      </div>
      {tech && (
        <form
          className={styles.editTechForm}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label htmlFor="first_name">First Name:</label>
            {editing ? (
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={tech.first_name}
                onChange={(e) =>
                  setTech({ ...tech, first_name: e.target.value })
                }
              />
            ) : (
              <p>{tech.first_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="last_name">Last Name:</label>
            {editing ? (
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={tech.last_name}
                onChange={(e) =>
                  setTech({ ...tech, last_name: e.target.value })
                }
              />
            ) : (
              <p>{tech.last_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            {editing ? (
              <input
                type="email"
                name="email"
                id="email"
                value={tech.email}
                onChange={(e) => setTech({ ...tech, email: e.target.value })}
              />
            ) : (
              <p>{tech.email}</p>
            )}
          </div>
          <div className={styles.imageBlock}>
            <img
              className={styles.techImage}
              src={tech.profile_pic}
              alt="Profile Pic"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
            {editing && (
              <>
                <input
                  type="file"
                  name="profile_pic"
                  id="profile_pic"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </>
            )}
          </div>
          {editing && <button type="submit">Submit</button>}
        </form>
      )}
    </>
  );
};

export default EditTech;
