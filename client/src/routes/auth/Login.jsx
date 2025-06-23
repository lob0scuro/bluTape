import toast from "react-hot-toast";
import Button from "../../components/Button";
import { fetchUsers } from "../../utils/API";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContext";

const Login = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  useEffect(() => {
    const get = async () => {
      const got = await fetchUsers();
      if (!got.success) {
        toast.error(got.error);
        navigate("/register");
      }
      setUsers(got.users);
    };
    get();
  }, []);

  const submitform = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData.entries());
      if (inputs.id === "") {
        toast.error("Please select a user to login");
        return;
      }
      if (inputs.password.trim() === "") {
        toast.error("Enter password to login");
        return;
      }
      const loggingIn = await login(inputs);
      if (!loggingIn.success) {
        throw new Error(loggingIn.error);
      }
      toast.success(loggingIn.message);
      setUser(loggingIn.user);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form className={styles.loginForm} onSubmit={submitform}>
        <div>
          <label htmlFor="id">Select Technician</label>
          <select name="id" id="id">
            <option value="">--Select User--</option>
            {users?.map(({ id, first_name, last_name }) => (
              <option value={id} key={id}>
                {first_name} {last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <Button title="Submit" type="submit" />
      </form>
      <Link className={styles.resetLink} to="/request-password-reset">
        Forgot Password?
      </Link>
    </>
  );
};

export default Login;
