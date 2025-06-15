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
      body: JSON.stringify({ prompt: query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error from AI pipeline");
    }

    const data = await response.json();

    return {
      filters: data.parsed_intent || {},
      listings: data.property_data?.property || [],
      attom_raw: data.property_data,
      ai_summary: data.parsed_intent?.user_notes || "",
    };
  } catch (error) {
    console.error("❌ smartPropertySearch failed:", error);
    throw error;
  }
};
