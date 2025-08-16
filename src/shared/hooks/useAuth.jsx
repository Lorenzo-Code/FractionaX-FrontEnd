import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  
  return {
    ...context,
    isAuthenticated: Boolean(context.user)
  };
};

export default useAuth;
