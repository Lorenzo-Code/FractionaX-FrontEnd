// src/utils/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * AI-powered property search via FractionaX backend
 */
export const smartPropertySearch = async (query) => {
  try {
    const response = await fetch(`${API_URL}/api/ai-pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query }), // ✅ use correct key
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ smartPropertySearch failed:", error);
    throw error;
  }
};
