import styles from "../style/EditTech.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOneTech } from "../utils";

const EditTech = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tech, setTech] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getIt = async () => {
      const gotIt = await fetchOneTech(id);
      setTech(gotIt);
    };
    getIt();
  }, [id]);

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
      const response = await fetch(`/auth/update_tech/${id}`, {
        method: "PATCH",
        body: form_data,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setMessage(data.message);
      navigate("/");
    } catch (error) {
      setError("There was an error.");
    }
  };

  return (
    <>
      <form
        className={styles.editTechForm}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            defaultValue={tech.first_name}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            defaultValue={tech.last_name}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={tech.email}
          />
        </div>
        <div className={styles.imageBlock}>
          <label htmlFor="profile_pic">Profile Photo</label>
          <img
            src={tech.profile_pic}
            alt="Profile Pic"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <input
            type="file"
            name="profile_pic"
            id="profile_pic"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default EditTech;
