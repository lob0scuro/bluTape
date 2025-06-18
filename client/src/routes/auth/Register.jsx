import toast from "react-hot-toast";
import Button from "../../components/Button";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData.entries());
      inputs.is_admin = is_admin.checked;
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Nope. try again");
        throw new Error(data.error);
      }
      toast.success(data.message);
      console.log("Success, going home.");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={submitForm} className={styles.registerForm}>
        <div className={styles.check}>
          <label htmlFor="is_admin">Admin</label>
          <input type="checkbox" name="is_admin" id="is_admin" />
        </div>
        <div>
          <label htmlFor="position">Position</label>
          <select name="position" id="position">
            <option value="">--select position--</option>
            {[
              "Technician",
              "Cleaner",
              "Sales",
              "Driver",
              "Office",
              "Service",
            ].map((val) => (
              <option value={val} key={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input type="text" name="first_name" id="first_name" />
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input type="text" name="last_name" id="last_name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password2">Re-Enter Password</label>
          <input type="password" name="password2" id="password2" />
        </div>

        <Button title="Submit" type="submit" />
      </form>
    </>
  );
};

export default Register;
