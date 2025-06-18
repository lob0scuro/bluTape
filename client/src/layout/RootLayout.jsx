import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../routes/helpers/Error";

const RootLayout = () => {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </ErrorBoundary>
  );
};

export default RootLayout;
