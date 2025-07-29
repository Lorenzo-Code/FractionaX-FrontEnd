import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // <-- ✅ Import added

import App from "./App.jsx";
import AuthProvider from "@/context/AuthProvider";
import { InteractionLockProvider } from "@/context/InteractionLockContext";

import "./index.css";

// RainbowKit / Wagmi
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseGoerli } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: "FractionaX",
  projectId: "your-walletconnect-project-id", // Replace this with your real ID
  chains: [baseGoerli, base],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider> {/* ✅ Wrap entire app */}
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
    </HelmetProvider>
  </React.StrictMode>
);
