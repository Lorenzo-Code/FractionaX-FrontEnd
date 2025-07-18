// Pure context export — avoids Fast Refresh errors
import { createContext } from "react";

const AuthContext = createContext(null);
export default AuthContext;
