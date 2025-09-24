import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/error/ErrorFallback.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthContext>
        <App />
      </AuthContext>
    </ErrorBoundary>
  </StrictMode>
);
