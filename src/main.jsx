import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

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

// WalletConnect Project ID from https://cloud.walletconnect.com
const config = getDefaultConfig({
  appName: "FractionaX",
  projectId: "your-walletconnect-project-id", // Replace with actual value
  chains: [baseGoerli, base],
});

// Required for wagmi caching
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
