// src/utils/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Generic POST request to your backend AI search endpoint
 */
export const smartPropertySearch = async (query) => {
  try {
    const response = await fetch(`${API_URL}/api/ai-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ smartPropertySearch failed:", error);
    throw error;
  }
};
