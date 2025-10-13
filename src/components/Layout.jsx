// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet /> {/* Dynamically loads page content */}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
