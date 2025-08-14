import styles from "./Footer.module.css";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Footer = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const logginOut = await logout();
    toast.success(logginOut.message);
    navigate("/login");
  };
  return (
    <footer className={styles.footer}>
      {user && (
        <div className={styles.logoutLink}>
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
      <div>
        <p>bluTape/</p>
        <p>Matt's Appliances, LLC</p>
      </div>
    </footer>
  );
};

export default Footer;
