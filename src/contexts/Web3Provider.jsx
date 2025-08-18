// File: iwasthere/new-frontend/src/contexts/Web3Provider.jsx
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi'; // The correct provider from wagmi
import { polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors'; // The connector for MetaMask and browser wallets

// 1. Create the final, correct wagmi v2 config
const config = createConfig({
  chains: [polygon],
  connectors: [
    injected(), // This is the simplest connector and does not require a projectId
  ],
  transports: {
    [polygon.id]: http(),
  },
});

// 2. Create a React Query client
const queryClient = new QueryClient();

// 3. Create our provider component
export function Web3Provider({ children }) {
  return (
    // This is the OFFICIAL <WagmiProvider> from wagmi v2
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}