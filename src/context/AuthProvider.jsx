import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Better JWT parsing with validation
          const parts = token.split('.');
          if (parts.length !== 3) {
            throw new Error('Invalid token format');
          }
          
          const decoded = JSON.parse(atob(parts[1]));
          
          // Check if token is expired
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.warn('Token expired, clearing auth state');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_role');
            setUser(null);
            return;
          }
          
          setUser({
            email: decoded.email,
            role: decoded.role,
            id: decoded._id || decoded.id, // Handle both _id and id
            ...decoded // Include any other decoded fields
          });
          
          if (process.env.NODE_ENV === 'development') {
            console.log('User authenticated:', { 
              email: decoded.email, 
              role: decoded.role,
              id: decoded._id || decoded.id,
              exp: new Date(decoded.exp * 1000).toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to parse auth token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_role');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
