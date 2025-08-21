// Import React polyfill first to ensure createContext is available
import "./shared/utils/reactPolyfill.js";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import AuthProvider from "@/context/AuthProvider";
import { InteractionLockProvider } from "@/context/InteractionLockContext";

import "./index.css";
import "./shared/utils/errorHandler.js"; // Global error handler for PostMessage and third-party issues

// RainbowKit / Wagmi
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseGoerli } from 'wagmi/chains';

// Only initialize WalletConnect if we have a valid project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
let config;

if (projectId && projectId.length > 0 && projectId !== '00000000000000000000000000000000') {
  config = getDefaultConfig({
    appName: "FractionaX",
    projectId: projectId,
    chains: [baseGoerli, base],
    ssr: false, // Disable server-side rendering issues
  });
} else {
  // Minimal config for development without WalletConnect
  console.warn('🔗 WalletConnect disabled: No valid project ID provided');
  config = getDefaultConfig({
    appName: "FractionaX",
    projectId: "dev-fallback-id", // Minimal fallback for dev
    chains: [baseGoerli, base],
    ssr: false,
  });
}

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

// Register service worker for performance improvements
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
