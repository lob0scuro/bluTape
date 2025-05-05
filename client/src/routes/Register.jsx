import styles from "../style/Register.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.target;
    const form_data = new FormData(form);
    form_data.set("is_admin", form.is_admin.checked);
    if (file) {
      form_data.set("profile_pic", file);
    }
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        body: form_data,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setMessage(data.message);
      navigate("/login");
    } catch (error) {
      setError("There was an error.");
    }
  };

  return (
    <>
      <h1>Register New Tech</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form
        className={styles.registrationForm}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="first_name">First Name: </label>
          <input type="text" name="first_name" id="first_name" />
        </div>
        <div>
          <label htmlFor="last_name">Last Name: </label>
          <input type="text" name="last_name" />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" name="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Password: </label>

          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password2">Re-Type Password: </label>
          <input type="password" name="password2" id="password2" />
        </div>
        <div className={styles.pos}>
          <label htmlFor="role">Position: </label>
          <select name="role" id="role">
            <option value="">--Select Position--</option>
            <option value="0">Refrigerators</option>
            <option value="1">Washers</option>
            <option value="2">Dryers/Ranges</option>
            <option value="3">Sales</option>
            <option value="4">Office</option>
          </select>
        </div>
        <div className={styles.admin}>
          <label htmlFor="is_admin">Administrator: </label>
          <input type="checkbox" name="is_admin" />
        </div>
        <div className={styles.pic}>
          <label htmlFor="profile_pic">Profile Picture: </label>
          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Register;
