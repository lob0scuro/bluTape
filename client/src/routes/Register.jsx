import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    is_admin: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        alert("There was an issue");
        throw new Error("Error: ", response.statusText);
      }
      const data = await response.json();
      alert(data.message);
      navigate("/login-page");
    } catch (error) {
      alert("There was an error");
      throw new Error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" id="role" onChange={handleChange} required>
            <option value="">--Select Tech Role--</option>
            <option value="0">Fridges</option>
            <option value="1">Washers</option>
            <option value="2">Dryers and Ranges</option>
          </select>
        </div>
        <div>
          <label htmlFor="is_admin">Admin</label>
          <input
            type="checkbox"
            name="is_admin"
            id="is_admin"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
