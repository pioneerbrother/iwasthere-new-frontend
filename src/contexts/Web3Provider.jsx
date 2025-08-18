// File: iwasthere/new-frontend/src/contexts/Web3Provider.jsx
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider as WagmiV2Provider } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const projectId = '2d36d710dfc9facf39435ab85cac3c87';

const metadata = {
  name: 'Sentry by iwasthere.watch',
  description: 'On-Chain Monitoring and Alerts',
  url: 'https://www.iwasthere.watch',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [polygon];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata
});

// THIS IS THE FIX
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  // This tells the modal to use the redirect flow for desktop
  desktopWallets: [{
    id: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    name: 'MetaMask',
    imageUrl: 'https://docs.walletconnect.com/assets/images/metamask-icon-01f2d3f23758a8a7c293ec5c4897f225.png'
  }]
});

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  return (
    <WagmiV2Provider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiV2Provider>
  );
}

