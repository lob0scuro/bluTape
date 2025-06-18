import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({ title, type = "button", isSecondary, ...props }) => {
  return (
    <button
      className={clsx(isSecondary ? styles.secondaryBtn : styles.btn)}
      type={type}
      {...props}
    >
      {title}
    </button>
  );
};

export default Button;
