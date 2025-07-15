// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Properties", path: "/admin/properties" },
    { name: "Tokens", path: "/admin/tokens" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("rememberedEmail");
    navigate("/"); // or "/login" if you use a dedicated login route
  };


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
        <h1 className="text-2xl font-bold mb-6">⚙️ FractionaX Admin</h1>
        <nav className="space-y-2">
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${
                pathname === path ? "bg-gray-700" : ""
              }`}
              >
                  {name}
              </Link>
          ))}
              </nav>
              <hr className="border-gray-700 my-6" />
              <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
              >
                  🚪 Logout
              </button>
          </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
