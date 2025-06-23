import styles from "./ResetPassword.module.css";
import React from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    inputs.token = token;
    try {
      const response = await fetch("/auth/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
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
      <h1>Reset your password</h1>
      <form onSubmit={submitForm} className={styles.resetForm}>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password-check">Re-enter password</label>
          <input type="password" name="password-check" id="password-check" />
        </div>
        <Button title="Submit" type="submit" />
      </form>
    </>
  );
};

export default ResetPassword;
