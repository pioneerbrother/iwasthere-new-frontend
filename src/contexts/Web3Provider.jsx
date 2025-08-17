// File: iwasthere/new-frontend/src/contexts/Web3Provider.jsx
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider as WagmiV2Provider } from 'wagmi' // Use the correct V2 provider
import { polygon } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Get project ID
const projectId = '2d36d710dfc9facf39435ab85cac3c87';

// 2. Create metadata
const metadata = {
  name: 'Sentry by iwasthere.watch',
  description: 'On-Chain Monitoring and Alerts',
  url: 'https://www.iwasthere.watch',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 3. Create wagmiConfig
const chains = [polygon];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata
});

// 4. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains
});

// 5. Setup QueryClient
const queryClient = new QueryClient();

// This is our correctly named wrapper component
export function Web3Provider({ children }) {
  return (
    // This is the OFFICIAL <WagmiProvider> from the wagmi library
    <WagmiV2Provider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiV2Provider>
  );
}