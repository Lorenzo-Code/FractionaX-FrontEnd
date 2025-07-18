import React, { useState, useEffect } from "react";
import { useInteractionLock } from "@/context/InteractionLockContext"; // Optional if locking

export default function DevelopmentModal({ visible }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { setLocked } = useInteractionLock?.() || { setLocked: () => {} }; // fallback if not used

  // Always call hooks first — not inside conditionals
  useEffect(() => {
    if (visible) {
      setLocked?.(true); // lock navbar
      document.body.style.overflow = "hidden";
    } else {
      setLocked?.(false);
      document.body.style.overflow = "";
    }
  }, [visible]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://api.fractionax.io/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data?.error || "❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("❌ Subscription failed:", err);
      alert("❌ Network error. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🚧 Marketplace Under Development
            </h2>
            <p className="text-gray-600 mb-4">
              We’re building something powerful. Enter your email and we'll notify you when it's ready.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
              >
                Notify Me
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-green-700">🎉 You’re on the list!</h2>
            <p className="text-gray-700">
              Thanks for signing up — you're now part of the early group getting access to the future of real estate investing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
