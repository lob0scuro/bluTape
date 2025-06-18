import React from "react";

const Error = ({ error, resetErrorBoundary }) => {
  const styles = {
    box: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      width: "100vw",
      height: "100%",
    },
    errorText: {
      color: "red",
    },
    btn: {
      padding: "8px 10px",
      borderRadius: "12px",
      fontSize: "18px",
      backgroundColor: "var(--buttonPrimary)",
      color: "var(--textPrimary)",
      border: "none",
    },
  };
  return (
    <div style={styles.box}>
      <h3>Something went wrong...</h3>
      <pre style={styles.errorText}>{error.message}</pre>
      <button style={styles.btn} onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
};

export default Error;
