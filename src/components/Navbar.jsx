// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Strada</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/valuation" className="hover:text-yellow-300">Valuation</Link>
        <Link to="/about" className="hover:text-yellow-300">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
