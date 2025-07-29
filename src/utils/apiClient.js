// src/utils/apiClient.js

const LOCAL_API = "http://localhost:5000";
const PROD_API = "https://api.fractionax.io";

/**
 * Attempts to fetch from local API first, and falls back to production if it fails.
 * @param {string} path - The API route (e.g., "/api/email/subscribe")
 * @param {object} options - fetch options (headers, method, body, etc.)
 */
export const saveBlogDraft = (data) =>
  smartFetch('/api/blogs/autosave', {
    method: 'POST',
    body: JSON.stringify(data), // ✅ fix here
  });


export const smartFetch = async (path, options = {}) => {
  // Add auth token to headers if available
  const token = localStorage.getItem('access_token');
  const defaultOptions = {
    credentials: "include", // Include cookies and sessions
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    ...options,
  };

  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log("📍 smartFetch called:", path, {
      ...defaultOptions,
      headers: {
        ...defaultOptions.headers,
        Authorization: token ? 'Bearer [REDACTED]' : undefined
      }
    });
  }

  try {
    const localRes = await fetch(`${LOCAL_API}${path}`, defaultOptions);

    if (!localRes.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Local API responded with error:", localRes.status, localRes.statusText);
      }
      
      // Handle specific error cases
      if (localRes.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.info("✅ Using LOCAL API:", `${LOCAL_API}${path}`);
    }

    return localRes;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ Local API unavailable. Trying PROD API:", `${PROD_API}${path}`);
    }
    
    try {
      const prodRes = await fetch(`${PROD_API}${path}`, defaultOptions);
      
      if (prodRes.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      
      return prodRes;
    } catch (prodErr) {
      console.error('Both LOCAL and PROD APIs failed:', { localError: err, prodError: prodErr });
      throw prodErr;
    }
  }
};
