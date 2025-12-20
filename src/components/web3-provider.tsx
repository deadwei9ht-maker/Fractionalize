'use client';

import { createWeb3Modal, defaultEthersConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, goerli } from 'wagmi/chains';
import * as React from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

const { chains, publicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

const ethersConfig = defaultEthersConfig({
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

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
