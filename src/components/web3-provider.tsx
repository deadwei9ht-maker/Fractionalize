'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import * as React from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  console.warn("WalletConnect Project ID is not set. Wallet functionality will be disabled. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.");
}

const chains = [mainnet, goerli];

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
});


// Only initialize Web3Modal if the project ID is available
if (projectId) {
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
    chains,
    projectId,
    enableAnalytics: true,
  });
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
