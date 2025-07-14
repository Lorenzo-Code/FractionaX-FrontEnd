// PreSaleModal.jsx
import React, { useState } from "react";

export default function PreSaleModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const API_BASE = import.meta.env.VITE_BASE_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/pre-sale-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Pre-sale signup failed:", err);
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join the FCT Pre-Sale</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email to reserve early access and receive pre-sale updates.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Notify Me
          </button>
        </form>
        {status === "success" && (
          <p className="text-sm text-green-600 mt-2">✅ You’re on the list!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600 mt-2">❌ Please enter a valid email.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
