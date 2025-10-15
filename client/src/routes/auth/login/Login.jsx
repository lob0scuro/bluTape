import styles from "./Login.module.css";
import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/API";
import toast from "react-hot-toast";
import Button from "../../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const { setUser, setLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState(0);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getEm = async () => {
      const response = await fetch(`/api/read/get_users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
      console.log(data.data);
      setUsers(data.data);
    };
    getEm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/login/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setLoading(false);
      toast.success(data.message);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }
  };
  return (
    <>
      <h1 className={styles.loginHeader}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div>
          <label htmlFor="id">Select Technician</label>
          <select
            name="id"
            id="id"
            value={userID}
            onChange={(e) => setUserID(Number(e.target.value))}
          >
            <option value="">--Select User--</option>
            {users?.map(({ id, first_name, last_name }) => (
              <option key={id} value={id}>
                {first_name} {last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button label="Submit" type="submit" />
      </form>
    </>
  );
};

export default Login;
