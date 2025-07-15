// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch("https://api.fractionax.io/api/admin/dashboard", {
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
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      {error ? (
        <p style={{ color: "red" }}>⛔ {error}</p>
      ) : (
        <p>✅ {message}</p>
      )}
    </div>
  );
};

export default AdminDashboard;
