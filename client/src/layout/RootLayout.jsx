import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default RootLayout;
