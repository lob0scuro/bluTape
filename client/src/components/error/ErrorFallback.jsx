import React from "react";
import Button from "../buttons/Button";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" style={{ padding: "1rem", border: "1px solid red" }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button label={"Try again"} onClick={resetErrorBoundary} />
      Try again
    </div>
  );
};

export default ErrorFallback;
