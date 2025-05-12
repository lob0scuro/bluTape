import styles from "../style/Login.module.css";
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { fetchAllTechs } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const [techs, setTechs] = useState([]);
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const retrieveTechs = async () => {
      const techList = await fetchAllTechs();
      if (!techList) {
        navigate("/register");
      }
      setTechs(techList);
    };
    retrieveTechs();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData.entries());

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        return { error: data.error || `Error: ${response.statusText}` };
      }
      localStorage.setItem("loggedInUser", JSON.stringify(data.tech));
      setUser(data.tech);
      toast.success(data.message);
      setTimeout(() => {}, 4000);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  };

  const renderTechOptions = techs.map((tech) => (
    <option key={tech.id} value={tech.id}>
      {tech.first_name} {tech.last_name}
    </option>
  ));

  return (
    <>
      <form onSubmit={submitForm} className={styles.loginForm}>
        <h1>Login</h1>
        <div>
          <select name="tech_id" id="tech_id">
            <option value="">--Select Technician--</option>
            {renderTechOptions}
          </select>
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password..."
            required
          />
        </div>
        <button type="submit">Login</button>
        <Link>Forgot Password?</Link>
      </form>
    </>
  );
};

export default Login;
