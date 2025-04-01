import styles from "../style/Register.module.css";
import React, { useEffect, useState } from "react";
import { fetchAllTechs } from "../utils.jsx";

const Register = () => {
  return (
    <>
      <h1>Register Technician</h1>
      <form className={styles.registrationForm} action="">
        <div>
          <label htmlFor="first_name">First Name: </label>
          <input type="text" name="first_name" />
        </div>
        <div>
          <label htmlFor="last_name">Last Name: </label>
          <input type="text" name="last_name" />
        </div>
        <div className={styles.position}>
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
        </div>
        <div>
          <label htmlFor="password">Password: </label>
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
