// src/utils/apiClient.js

const LOCAL_API = "http://localhost:5000";
const PROD_API = "https://api.fractionax.io";

/**
 * Attempts to fetch from local API first, and falls back to production if it fails.
 * @param {string} path - The API route (e.g., "/api/admin/dashboard")
 * @param {object} options - fetch options (headers, method, body, etc.)
 */
export const smartFetch = async (path, options = {}) => {
  try {
    const localRes = await fetch(`${LOCAL_API}${path}`, options);
    if (!localRes.ok) throw new Error("Local API failed");
    console.info("✅ Using LOCAL API:", `${LOCAL_API}${path}`);
    return localRes;
  } catch (err) {
    console.warn("⚠️ Local API unavailable. Using PROD API:", `${PROD_API}${path}`);
    const prodRes = await fetch(`${PROD_API}${path}`, options);
    return prodRes;
  }
};
