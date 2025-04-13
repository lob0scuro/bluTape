import { useActionState } from "react";
import styles from "../style/Register.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const submitForm = async (prevState, formData) => {
    const formEntries = Object.fromEntries(formData);
    formEntries.is_admin = formEntries.is_admin === "on";

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formEntries),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`There was an error ${response.statusText}`);
        return { error: data.error || `Error: ${response.statusText}` };
      }
      navigate("/login");
      return { message: data.message };
    } catch (error) {
      alert("There was an error");
      return { error: "There was an error" };
    }
  };

  const [state, formAction] = useActionState(submitForm, {
    message: "",
    error: "",
  });

  return (
    <>
      <h1>Register Technician</h1>
      {state.message && <p style={{ color: "green" }}>{state.message}</p>}
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <form className={styles.registrationForm} action={formAction}>
        <div>
          <label htmlFor="first_name">First Name: </label>
          <input type="text" name="first_name" />
        </div>
        <div>
          <label htmlFor="last_name">Last Name: </label>
          <input type="text" name="last_name" />
        </div>
        {/* <div className={styles.position}> */}
        <div>
          <label htmlFor="role">Position: </label>
          <select name="role" id="role">
            <option value="">--Select Position--</option>
            <option value="0">Refrigerators</option>
            <option value="1">Washers</option>
            <option value="2">Dryers/Ranges</option>
          </select>
        </div>
        <div>
          <label htmlFor="is_admin">Administrator: </label>
          <input type="checkbox" name="is_admin" />
        </div>
        {/* </div> */}
        <div>
          <label htmlFor="password">Password: </label>
          <br />
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password2">Re-Type Password: </label>
          <input type="password" name="password2" id="password2" />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Register;
