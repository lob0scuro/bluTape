import styles from "./Register.module.css";
import React, { useState } from "react";
import Button from "../../../components/buttons/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ROLES = {
  0: "Office",
  1: "Fridge Tech",
  2: "Washer Tech",
  3: "Dryer & Range Tech",
};

const Register = () => {
  const [formData, setFormData] = useState({
    is_admin: false,
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
    password2: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate("/admin-panel");
    } catch (error) {
      toast.error("There was an error");
      console.error(error);
      return;
    }
  };

  return (
    <>
      <Button
        label={"Back to Admin Panel"}
        onClick={() => navigate("/admin-panel")}
      />
      <br />
      <h1 className={styles.registerHeader}>Register New User</h1>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.adminContainer}>
          <label htmlFor="is_admin">Admin</label>
          <input
            type="checkbox"
            name="is_admin"
            id="is_admin"
            value={formData.is_admin}
            onChange={(e) =>
              setFormData({ ...formData, is_admin: e.target.checked })
            }
          />
        </div>
        <div>
          <label htmlFor="role">Position</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: Number(e.target.value) })
            }
            required
          >
            <option value="">--Select Position</option>
            {Object.entries(ROLES).map(([num, text]) => (
              <option key={num} value={num}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
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
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password1">Password</label>
          <input
            type="password"
            name="password1"
            id="password1"
            value={formData.password1}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password2">Re-Enter Password</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <Button label={"Submit"} type="submit" />
      </form>
    </>
  );
};

export default Register;
