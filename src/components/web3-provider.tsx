
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import * as React from 'react';

// 1. Get projectID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// 2. Set up wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
});

const metadata = {
  name: 'NFT Fractionalizer',
  description: 'Turn any NFT into 10,000 tradable tokens in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

// Create the modal outside the component to ensure it's a singleton.
if (projectId) {
  createWeb3Modal({
    ethersConfig: defaultConfig({
      metadata,
      defaultChainId: 5,
    }),
    chains: [mainnet, goerli],
    projectId,
    enableAnalytics: true,
  });
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!projectId) {
    // If projectId is not set, we don't render the provider or its children that might depend on it.
    // This prevents crashes and makes it clear that the feature is disabled.
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-center text-red-500">
                WalletConnect Project ID is not set.
                <br />
                Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file.
            </p>
        </div>
    );
  }

  // Only render the children once we are on the client
  return <WagmiConfig config={wagmiConfig}>{isClient ? children : null}</WagmiConfig>;
}
