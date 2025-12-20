'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import * as React from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn("WalletConnect Project ID is not set. Wallet functionality will be disabled. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.");
} else {
    const ethersConfig = defaultConfig({
      metadata: {
        name: 'NFT Fractionalizer',
        description: 'Turn any NFT into 10,000 tradable tokens in 1 click.',
        url: 'https://app.firebase-studio.into-the-studio.dev/',
        icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
      },
      defaultChainId: 5,
    });
    
    createWeb3Modal({
      ethersConfig,
      chains: [mainnet, goerli],
      projectId,
      enableAnalytics: true,
    });
}


// Initialize wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
});


export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!projectId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-center text-red-500">
          WalletConnect Project ID is not set. <br />
          Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file.
        </p>
      </div>
    );
  }

  return <WagmiConfig config={wagmiConfig}>{isClient ? children : null}</WagmiConfig>;
}
