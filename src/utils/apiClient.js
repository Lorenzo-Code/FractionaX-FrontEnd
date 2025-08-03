// const LOCAL_API = "http://localhost:5000";
// const PROD_API = "https://api.fractionax.io";

// /**
//  * Checks whether the body is FormData to avoid setting Content-Type manually
//  */
// const isFormData = (body) => typeof FormData !== "undefined" && body instanceof FormData;

// /**
//  * Centralized fetch handler with local → prod fallback + auth + file upload support
//  */
// export const smartFetch = async (path, options = {}) => {
//   const token = localStorage.getItem("access_token");
//   const isForm = isFormData(options.body);

//   const defaultHeaders = {
//     Accept: "application/json",
//     ...(isForm ? {} : { "Content-Type": "application/json" }),
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...(options.headers || {}),
//   };

//   const finalOptions = {
//     credentials: "include",
//     ...options,
//     headers: defaultHeaders,
//   };

//   const logRequest = (env, url) => {
//     console.log(`📡 [${env} API] → ${url}`);
//     if (process.env.NODE_ENV === "development") {
//       console.debug("🔍 Request Options:", {
//         ...finalOptions,
//         headers: {
//           ...finalOptions.headers,
//           Authorization: token ? "Bearer [REDACTED]" : undefined,
//         },
//       });
//     }
//   };

//   // Try LOCAL
//   try {
//     const localURL = `${LOCAL_API}${path}`;
//     logRequest("LOCAL", localURL);
//     const res = await fetch(localURL, finalOptions);
//     if (res.ok) return res;

//     if (res.status === 401) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }

//     console.warn("⚠️ LOCAL API failed:", res.status, res.statusText);
//   } catch (err) {
//     console.warn("🚧 LOCAL API unreachable:", err.message);
//   }

//   // Fallback to PROD
//   try {
//     const prodURL = `${PROD_API}${path}`;
//     logRequest("PRODUCTION", prodURL);
//     const res = await fetch(prodURL, finalOptions);

//     if (res.status === 401) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }

//     return res;
//   } catch (err) {
//     console.error("❌ Both LOCAL and PROD fetch failed:", err);
//     throw err;
//   }
// };

// /**
//  * Uploads a single image file using FormData
//  * @param {File} file - the image file to upload
//  * @returns {Promise<string>} - the uploaded image URL
//  */
// export const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("image", file);

//   const res = await smartFetch("/api/uploads", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error?.message || "Upload failed");
//   }

//   const data = await res.json();
//   return data.url;
// };

// /**
//  * Saves blog draft via JSON POST
//  */
// export const saveBlogDraft = (data) =>
//   smartFetch("/api/blogs/autosave", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });


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
        console.log("⚠️ Local API response:", localRes.status, localRes.statusText);
        const errorText = await localRes.clone().text().catch(() => "No detailed error message");
        console.warn("⚠️ Local API responded with error:", localRes.status, localRes.statusText, errorText);
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
