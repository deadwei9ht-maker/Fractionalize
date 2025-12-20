
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

// This is a client-only component, so we can safely use state and effects.
export function Web3Provider({ children }: { children: React.ReactNode }) {
  // We use state to hold the config and ensure we only initialize once.
  const [wagmiConfig, setWagmiConfig] = React.useState<any>(null);

  React.useEffect(() => {
    // This code will only run on the client side.
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please check your .env.local file.');
      return;
    }

    const metadata = {
      name: "Joshi's Share",
      description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
      url: 'https://app.firebase-studio.into-the-studio.dev/',
      icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
    };

    const chains = [baseSepolia];
    
    // Create the config inside the effect.
    const config = createConfig({
      ...defaultConfig({
        metadata,
        chains,
        projectId,
      }),
      chains,
    });

    // Create the modal inside the effect.
    createWeb3Modal({
      ethersConfig: config,
      chains,
      projectId,
      enableAnalytics: true,
    });
    
    // Set the config in state so the WagmiConfig provider can use it.
    setWagmiConfig(config);

  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // We only render the children after the config has been initialized on the client.
  if (!wagmiConfig) {
    return null;
  }

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
