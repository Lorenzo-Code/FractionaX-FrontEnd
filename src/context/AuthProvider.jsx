import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          email: decoded.email,
          role: decoded.role,
          id: decoded.id,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  checkAuth();

  // 👇 Add storage listener so login in another tab updates this tab
  window.addEventListener("storage", checkAuth);
  return () => window.removeEventListener("storage", checkAuth);
}, []);


  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
