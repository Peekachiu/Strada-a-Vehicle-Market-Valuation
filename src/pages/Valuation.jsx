// src/pages/Valuation.jsx
import React from "react";
import VehicleForm from "../components/VehicleForm";

const Valuation = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">
        Vehicle Valuation
      </h2>
      <VehicleForm />
    </div>
  );
};

export default Valuation;
