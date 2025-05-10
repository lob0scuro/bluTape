import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import Errors from "../components/Errors";

const RootLayout = () => {
  return (
    <ErrorBoundary FallbackComponent={Errors}>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" reverseOrder={false} />
    </ErrorBoundary>
  );
};

export default RootLayout;
