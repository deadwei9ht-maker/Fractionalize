
'use client';

import * as React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type WagmiConfig as WagmiConfigType } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

type Web3ProviderProps = {
  children: React.ReactNode;
  projectId: string;
};

// 1. Create wagmiConfig
const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/', // Make sure this is your app's URL
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'], // And this is your app's icon
};

const chains = [baseSepolia];
const wagmiConfig = createConfig(
  defaultConfig({
    chains,
    metadata,
    // projectId is a required argument for defaultConfig, but we will pass it to createWeb3Modal
    // We use a placeholder here to satisfy the type.
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'dummy-project-id',
    // Required, even if empty, for ethers5 modal
    walletConnectV2ProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'dummy-project-id',
  })
);


export function Web3Provider({ children, projectId }: Web3ProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // 3. Create modal
    if (projectId) {
        createWeb3Modal({
            ethersConfig: wagmiConfig,
            chains,
            projectId,
            enableAnalytics: true,
        });
        setIsInitialized(true);
    }
  }, [projectId]);


  return <WagmiConfig config={wagmiConfig}>{isInitialized ? children : null}</WagmiConfig>;
}
