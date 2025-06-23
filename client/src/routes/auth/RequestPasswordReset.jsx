import styles from "./ResetPassword.module.css";
import React from "react";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = Object.fromEntries(formData);
    try {
      const response = await fetch("/auth/request_password_reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };
  return (
    <>
      <h1 className={styles.resetHeader}>
        Enter your email to reset your password.
      </h1>
      <form className={styles.resetForm} onSubmit={submitForm}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <Button title="Submit" type="submit" />
      </form>
    </>
  );
};

export default ResetPassword;
