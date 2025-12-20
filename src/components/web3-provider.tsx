
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
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

// 3. Create modal outside of the component
if (projectId) {
    createWeb3Modal({
        ethersConfig: defaultConfig({
          metadata,
          defaultChainId: 11155111, // Sepolia
        }),
        chains: [mainnet, sepolia],
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
    // We can't render the provider if the project ID is missing.
    // Instead of throwing an error that crashes the app, we can show a message.
    if (isClient) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
              <p className="text-red-500">
                WalletConnect Project ID is not configured. Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your environment variables.
              </p>
            </div>
          );
    }
    return null;
  }

  return <WagmiConfig config={wagmiConfig}>{isClient ? children : null}</WagmiConfig>;
}
