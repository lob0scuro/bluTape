import styles from "../style/Login.module.css";
import { useActionState, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllTechs } from "../utils.jsx";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const [techs, setTechs] = useState([]);
  const { setUser } = useAuth();

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

  const navigate = useNavigate();
  const submitForm = async (prevState, formData) => {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
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
    navigate("/");
  };

  const [state, formAction] = useActionState(submitForm, {
    message: "",
    error: "",
  });

  const renderTechOptions = techs.map((tech) => (
    <option key={tech.id} value={tech.id}>
      {tech.first_name} {tech.last_name}
    </option>
  ));

  return (
    <>
      {/* {state.message && <p style={{ color: "green" }}>{state.message}</p>} */}
      {/* {state.error && <p style={{ color: "red" }}>{state.error}</p>} */}
      <form action={formAction} className={styles.loginForm}>
        <h1>Login</h1>
        <div>
          {/* <label htmlFor="tech_id">Technician: </label> */}
          <select name="tech_id" id="tech_id">
            <option value="">--Select Technician--</option>
            {renderTechOptions}
          </select>
        </div>
        <div>
          {/* <label htmlFor="password">Password: </label> */}
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password..."
          />
        </div>
        <button type="submit">Login</button>
        <Link>Forgot Password?</Link>
      </form>
    </>
  );
};

export default Login;
