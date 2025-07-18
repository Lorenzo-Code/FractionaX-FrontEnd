import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/context/AuthProvider";
import { InteractionLockProvider } from "@/context/InteractionLockContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <InteractionLockProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </InteractionLockProvider>
    </BrowserRouter>
  </React.StrictMode>
);
