// File: iwasthere/new-frontend/src/components/ConnectWallet.jsx
import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        <button onClick={() => disconnect()} style={{ marginLeft: '1rem' }}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors
        .filter((c) => c.ready) // Only show ready connectors (e.g., if MetaMask is installed)
        .map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })}>
            Connect {connector.name}
            {isLoading && connector.id === pendingConnector?.id && ' (connecting...)'}
          </button>
        ))}
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </div>
  );
}