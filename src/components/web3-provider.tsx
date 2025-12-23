
'use client';

import * as React from 'react';
import {
  createWeb3Modal,
  defaultConfig,
} from '@web3modal/ethers5/react';
import {
  WagmiConfig,
  createConfig,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

type Web3ProviderProps = {
  children: React.ReactNode;
  projectId: string;
};

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const chains = [baseSepolia];

// We have to create the config outside the component.
const wagmiConfig = createConfig(
  defaultConfig({
    chains,
    metadata,
    // projectId is a required argument for defaultConfig, but we will pass it to createWeb3Modal
    // We use a placeholder here to satisfy the type.
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'dummy-id',
  })
);

export function Web3Provider({ children, projectId }: Web3ProviderProps) {
  const [initialized, setInitialized] = React.useState(false);
  
  React.useEffect(() => {
    if (projectId) {
      createWeb3Modal({
        ethersConfig: wagmiConfig,
        chains,
        projectId,
        enableAnalytics: true,
      });
      setInitialized(true);
    }
  }, [projectId]);

  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
