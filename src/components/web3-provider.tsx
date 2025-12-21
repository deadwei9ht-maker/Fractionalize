'use client';

import * as React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type WagmiConfig as WagmiConfigType } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

type Web3ProviderProps = {
  children: React.ReactNode;
  projectId: string;
};

export function Web3Provider({ children, projectId }: Web3ProviderProps) {
  const [config, setConfig] = React.useState<WagmiConfigType | null>(null);

  React.useEffect(() => {
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
        projectId,
        // Required, even if empty, for ethers5 modal
        walletConnectV2ProjectId: projectId,
      })
    );

    // 3. Create modal
    createWeb3Modal({
      ethersConfig: wagmiConfig,
      chains,
      projectId,
      enableAnalytics: true,
    });
    
    // 4. Set the config in state to trigger a re-render with the provider
    setConfig(wagmiConfig);

  }, [projectId]);

  // Render children ONLY after the config has been initialized on the client.
  if (!config) {
    return null;
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
