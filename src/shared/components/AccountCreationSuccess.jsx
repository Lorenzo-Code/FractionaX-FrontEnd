import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const AccountCreationSuccess = () => {
  const navigate = useNavigate();

  // Auto-redirect after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6">
      <motion.div
        className="bg-[#262a3b] p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
        <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
        <p className="text-sm text-gray-300">
          Please check your email and confirm your address to complete your signup.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          You’ll be redirected to the homepage shortly...
        </p>
      </motion.div>
    </div>
  );
};

export default AccountCreationSuccess;
