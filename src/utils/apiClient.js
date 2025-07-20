// src/utils/apiClient.js

const LOCAL_API = "http://localhost:5000";
const PROD_API = "https://api.fractionax.io";

/**
 * Attempts to fetch from local API first, and falls back to production if it fails.
 * @param {string} path - The API route (e.g., "/api/email/subscribe")
 * @param {object} options - fetch options (headers, method, body, etc.)
 */
export const smartFetch = async (path, options = {}) => {
  const defaultOptions = {
    credentials: "include", // ✅ Include cookies and sessions
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const localRes = await fetch(`${LOCAL_API}${path}`, defaultOptions);

    if (!localRes.ok) {
      console.warn("⚠️ Local API responded with error:", localRes.status);
    } else {
      console.info("✅ Using LOCAL API:", `${LOCAL_API}${path}`);
    }

    return localRes;
  } catch (err) {
    console.warn("⚠️ Local API unavailable. Using PROD API:", `${PROD_API}${path}`);
    return await fetch(`${PROD_API}${path}`, defaultOptions);
  }
};
