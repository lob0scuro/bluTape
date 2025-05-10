import styles from "../style/Errors.module.css";

const Errors = ({ error, resetErrorBoundary }) => {
  return (
    <div className={styles.errorBlock}>
      <h3>Something went wrong...</h3>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default Errors;
