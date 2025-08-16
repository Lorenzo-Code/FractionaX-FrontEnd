import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { smartFetch } from '../../../shared/utils';
import { SEO } from '../../../shared/components';
import { useAuth } from '../../../shared/hooks';

const SignUpLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
    twoFactorToken: "",
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [success, setSuccess] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

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

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters`);
    if (!hasUpper) errors.push("Must contain uppercase letter");
    if (!hasLower) errors.push("Must contain lowercase letter");
    if (!hasNumber) errors.push("Must contain number");
    if (!hasSymbol) errors.push("Must contain special character");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Validation for sign up
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
          setError(`Password requirements not met: ${passwordErrors.join(", ")}`);
          setLoading(false);
          return;
        }

        const response = await smartFetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const result = await response.json();
        console.log("Registration result:", result);

        if (!response.ok) {
          throw new Error(result.error || result.msg || "Registration failed.");
        }

        setSuccess("✅ Registration successful! You can now sign in with your credentials.");
        setIsSignUp(false);
        // Clear form except email
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          twoFactorToken: "",
        }));
        return;
      }

      // LOGIN
      const loginPayload = {
        email: formData.email,
        password: formData.password,
      };

      // Include 2FA token if required
      if (requiresTwoFactor && formData.twoFactorToken) {
        loginPayload.twoFactorToken = formData.twoFactorToken;
      }

      const response = await smartFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const result = await response.json();
      console.log("Login result:", result);

      if (!response.ok) {
        if (result.requiresTwoFactor) {
          setRequiresTwoFactor(true);
          setError("Please enter your 2FA code to complete login.");
          setLoading(false);
          return;
        }
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = result.retryAfter || "15 minutes";
          setError(`🔒 Too many login attempts. Please try again in ${retryAfter}. This is a security measure to protect your account.`);
          setLoading(false);
          return;
        }
        
        throw new Error(result.error || result.msg || "Login failed.");
      }

      // Check if 2FA is required
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setError("Please enter your 2FA code to complete login.");
        setLoading(false);
        return;
      }

      // Successful login
      if (!result.token) {
        throw new Error("No authentication token received.");
      }

      const { token, user } = result;

      // Store authentication data
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_role", user.role || "user");

      // Handle remember me functionality
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setSuccess("✅ Login successful! Redirecting...");


      // Force auth refresh to update the user state immediately
      if (checkAuth) {
        await checkAuth(true); // Force refresh
      }

      // Redirect based on user role with React Router navigate
      const redirectPath = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setRequiresTwoFactor(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError(null);
    setSuccess(null);
    setRequiresTwoFactor(false);
    setFormData(prev => ({
      ...prev,
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      twoFactorToken: "",
    }));
  };

  return (
    <>
      <SEO
        title={isSignUp ? "Sign Up | FractionaX" : "Sign In | FractionaX"}
        description={isSignUp ? "Create your FractionaX account to access AI-powered real estate investment tools, property tokenization, and premium features." : "Sign in to your FractionaX account to access your real estate investment dashboard, AI property search, and portfolio management tools."}
        keywords={isSignUp ? ["sign up", "create account", "register", "FractionaX", "real estate investment", "property tokenization"] : ["sign in", "login", "FractionaX", "real estate dashboard", "investment account", "property management"]}
        canonical={isSignUp ? "/signup" : "/login"}
        openGraph={{
          type: 'website',
          title: isSignUp ? 'Sign Up | FractionaX' : 'Sign In | FractionaX',
          description: isSignUp ? 'Create your FractionaX account to access AI-powered real estate investment tools and property tokenization.' : 'Sign in to your FractionaX account to access your investment dashboard and portfolio management tools.',
          url: isSignUp ? '/signup' : '/login',
          site_name: 'FractionaX'
        }}
        robots="noindex, nofollow"
      />
      <div className={`min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 overflow-y-auto ${isSignUp ? "pt-4 pb-10" : "pt-10 pb-10"}`}>
        <div
          ref={formRef}
          className="max-w-sm mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
        >
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
                : requiresTwoFactor
                  ? "Enter your 2FA code to complete login."
                  : "Sign in to your account."}
            </p>
          </motion.div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Sign Up Fields */}
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

            {/* Email Field */}
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
                disabled={requiresTwoFactor}
              />
            </div>

            {/* Password Field */}
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
                disabled={requiresTwoFactor}
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
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

            {/* 2FA Token Field */}
            {!isSignUp && requiresTwoFactor && (
              <div>
                <label htmlFor="twoFactorToken" className="block text-sm mb-1">2FA Code</label>
                <input
                  type="text"
                  id="twoFactorToken"
                  name="twoFactorToken"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your 2FA code"
                  value={formData.twoFactorToken}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the 6-digit code from your authenticator app or use a backup code.
                </p>
              </div>
            )}

            {/* Remember Me Checkbox (Login Only) */}
            {!isSignUp && !requiresTwoFactor && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="mr-2"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-400">
                  Remember my email
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-3 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : requiresTwoFactor
                  ? "Verify & Sign In"
                  : isSignUp
                    ? "Sign Up"
                    : "Sign In"
              }
            </button>
          </motion.form>

          {/* Toggle Between Sign Up/Sign In */}
          {!requiresTwoFactor && (
            <div className="text-center mt-6">
              <button
                disabled
                className="text-gray-400 cursor-not-allowed"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>

          )}

          {/* Back to Login from 2FA */}
          {requiresTwoFactor && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setRequiresTwoFactor(false);
                  setError(null);
                  setFormData(prev => ({ ...prev, twoFactorToken: "" }));
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                ← Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpLoginPage;
