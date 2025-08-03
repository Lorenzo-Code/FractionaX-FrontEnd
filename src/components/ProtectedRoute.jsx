import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

/**
 * Protects a route from unauthenticated or unauthorized access.
 * @param {ReactNode} children - The component to render if allowed.
 * @param {string} requiredRole - Optional role ("admin" or "user")
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Delay render until we know whether user is loaded
    const check = () => {
      const token = localStorage.getItem("access_token");
      if (process.env.NODE_ENV === 'development') {
        console.log('ProtectedRoute - Token check:', { 
          hasToken: !!token, 
          user: user, 
          requiredRole 
        });
      }
      setAuthChecked(true);
    };
    check();
  }, [user, requiredRole]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute - No user, redirecting to login');
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute - Role mismatch:', { userRole: user.role, requiredRole });
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
