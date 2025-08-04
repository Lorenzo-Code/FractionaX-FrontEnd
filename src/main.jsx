import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import AuthProvider from "@/context/AuthProvider";
import { InteractionLockProvider } from "@/context/InteractionLockContext";

import "./index.css";
import "./utils/errorHandler.js"; // Global error handler for PostMessage and third-party issues

// RainbowKit / Wagmi
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseGoerli } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: "FractionaX",
  projectId: "fractionax-local-dev", // Local development ID
  chains: [baseGoerli, base],
  ssr: false, // Disable server-side rendering issues
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <BrowserRouter>
              <InteractionLockProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </InteractionLockProvider>
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  </React.StrictMode>
);
