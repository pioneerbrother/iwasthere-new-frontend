// File: iwasthere/new-frontend/src/contexts/WagmiProvider.jsx
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { polygon } from 'wagmi/chains' // We are deploying on Polygon Mainnet
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = '4f76e00676a042219e9a7ec5400c5705' // IMPORTANT: Get your own Project ID

// 2. Create wagmiConfig
const metadata = {
  name: 'Sentry by iwasthere.watch',
  description: 'On-Chain Monitoring and Alerts',
  url: 'https://iwasthere.watch',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [polygon]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

// 4. Create React Query client
const queryClient = new QueryClient();

export function WagmiProvider({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiConfig>
  )
}