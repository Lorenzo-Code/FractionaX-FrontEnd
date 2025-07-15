// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { smartFetch } from "../../utils/apiClient";


const AdminHome = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchAdminData = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await smartFetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Unauthorized");

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchAdminData();
}, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      {error ? (
        <p className="text-red-600 font-medium">⛔ {error}</p>
      ) : (
        <p className="text-green-700 font-medium">✅ {message}</p>
      )}
    </div>
  );
};

export default AdminHome;
