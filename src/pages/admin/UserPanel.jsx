// src/pages/admin/UsersPanel.jsx
import React, { useEffect, useState } from "react";
import { smartFetch } from "../../utils/apiClient"; // adjust path if needed


const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await smartFetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Failed to load users");

    setUsers(data.users);
  } catch (err) {
    setError(err.message);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

const handlePromote = async (userId) => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await smartFetch(`/api/admin/users/${userId}/promote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Promotion failed");

    // Refresh user list
    fetchUsers();
  } catch (err) {
    alert("⛔ " + err.message);
  }
};


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>
      {error && <p className="text-red-600">⛔ {error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => handlePromote(user._id)}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 mr-2"
                    disabled={user.role === "admin"}
                  >
                    Promote to Admin
                  </button>
                  {/* Future: delete/disable buttons here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPanel;
