import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getTechs } from "../api/Calls";
import styles from "./LoginPage.module.css";
import { LoginContext } from "../App";

const LoginPage = () => {
  const [techs, setTechs] = useState([]);
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn, user, setUser] = useContext(LoginContext);

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
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || formData === "") {
      alert("Please select a technician");
      return;
    }
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: formData }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.message);
      localStorage.setItem("loggedInUser", JSON.stringify(data.tech));
      navigate("/");
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
