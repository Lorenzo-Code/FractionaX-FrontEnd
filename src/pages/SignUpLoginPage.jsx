import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignUpLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Load remembered email on first render
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  // Auto-scroll to top when switching modes
  useEffect(() => {
    if (formRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSignUp]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    if (isSignUp) {
      // ✅ Register New User
      const response = await fetch("https://api.fractionax.io/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Registration failed.");
      }

      alert("✅ Registration successful. You may now log in.");
      setIsSignUp(false);
    } else {
      // ✅ Login Existing User
      const response = await fetch("https://api.fractionax.io/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.token) {
        throw new Error(result.error || "Login failed.");
      }

      // ✅ Store token and user info
      localStorage.setItem("access_token", result.token);
      localStorage.setItem("user_email", result.user.email);
      localStorage.setItem("user_id", result.user.id);

      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // ✅ Decode JWT and redirect based on role
      try {
        const decoded = JSON.parse(atob(result.token.split('.')[1]));
        if (decoded.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (decodeError) {
        console.error("Failed to decode token:", decodeError);
        navigate("/dashboard"); // fallback
      }
    }
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

const toggleMode = () => {
  setIsSignUp((prev) => !prev);
  setError(null);
};

    return (
        <div className={`min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 overflow-y-auto ${isSignUp ? "pt-4 pb-10" : "pt-10 pb-10"
            }`}
        >
            <div
                ref={formRef}
                className="max-w-sm mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-3xl font-bold mb-2">
                        {isSignUp ? "Create Account" : "Welcome Back!"}
                    </h1>
                    <p className="text-gray-400">
                        {isSignUp
                            ? "Sign up to access premium features."
                            : "Sign in to your account."}
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    {isSignUp && (
                        <>
                            <div>
                                <label htmlFor="firstName" className="block text-sm mb-1">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your first name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm mb-1">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    {/* Divider & social only in login mode */}
                    {!isSignUp && (
                        <>
                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-gray-700" />
                                <span className="px-4 text-gray-500">OR</span>
                                <hr className="flex-grow border-gray-700" />
                            </div>
                            <button disabled className="w-full px-6 py-3 rounded-lg bg-gray-600 text-gray-400 mb-4 cursor-not-allowed">
                                Sign in with Gmail (Coming Soon)
                            </button>
                            <button disabled className="w-full px-6 py-3 rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed">
                                Sign in with Crypto Wallet (Coming Soon)
                            </button>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-3 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </motion.form>

                {/* Toggle */}
                <div className="text-center mt-6">
                    <button
                        onClick={toggleMode}
                        className="text-blue-400 hover:text-blue-600 transition"
                    >
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpLoginPage;
