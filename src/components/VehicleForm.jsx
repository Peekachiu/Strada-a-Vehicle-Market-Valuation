// src/components/VehicleForm.jsx
import React, { useState } from "react";

const VehicleForm = () => {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Later, you will connect this to your backend API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="brand"
        placeholder="Enter brand"
        value={form.brand}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="model"
        placeholder="Enter model"
        value={form.model}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="year"
        placeholder="Enter year"
        type="number"
        value={form.year}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="mileage"
        placeholder="Enter mileage (km)"
        type="number"
        value={form.mileage}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="condition"
        placeholder="Enter condition (e.g., Excellent, Good)"
        value={form.condition}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
        Predict Value
      </button>
    </form>
  );
};

export default VehicleForm;
