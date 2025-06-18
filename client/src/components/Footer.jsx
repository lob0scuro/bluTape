import styles from "./Footer.module.css";
import { useAuth } from "../context/UserContext";

const Footer = () => {
  const { logout, user } = useAuth();
  return (
    <footer className={styles.footer}>
      {user && (
        <div className={styles.logoutLink}>
          <p onClick={logout}>Logout</p>
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
