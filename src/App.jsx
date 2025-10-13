// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Valuation from "./pages/Valuation";
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes wrapped by the Layout (master page) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="valuation" element={<Valuation />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Optional: 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
