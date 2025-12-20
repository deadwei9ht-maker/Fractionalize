'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, goerli } from 'wagmi/chains';
import * as React from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
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
} else {
    console.warn("WalletConnect Project ID is not set. Wallet functionality will be disabled. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.");
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
