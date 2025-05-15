import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import Errors from "../components/Errors";
import MenuBubble from "../components/MenuBubble";

const RootLayout = () => {
  return (
    <ErrorBoundary FallbackComponent={Errors}>
      <Navbar />
      <div className="container">
        <Outlet />
        <MenuBubble />
      </div>
      <Footer />
      <Toaster position="bottom-right" reverseOrder={false} />
    </ErrorBoundary>
  );
};

export default RootLayout;
