import styles from "./LoginPage.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getTechs } from "../api/Calls";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
  const [techs, setTechs] = useState([]);
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();
  const { user, login } = useContext(UserContext);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const gotem = await getTechs();
        setTechs(gotem);
      } catch (error) {
        console.error("Failed to fetch technicians", error);
      }
    };
    fetchTechs();
  }, []);

  const handleFormChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || formData === "") {
      alert("Please select a technician");
      return;
    }
    try {
      login(formData);
    } catch (error) {
      console.error("Problem with login", error);
    }
  };

  const renderTechs = techs.map((tech) => (
    <option key={tech.id} value={tech.id}>
      {tech.first_name} {tech.last_name}
    </option>
  ));

  return (
    <>
      <h1 className={styles.loginHeader}>Login</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tech"> Select Technician </label>
        </div>
        <select name="tech" id="tech" onChange={handleFormChange}>
          <option value="">Select...</option>
          {renderTechs}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default LoginPage;
