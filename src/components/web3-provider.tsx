
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';
import type { WagmiConfig as WagmiConfigType } from 'wagmi';

// This is the definitive, correct implementation for a client-side only provider in Next.js.
// It ensures that no window/browser-specific code ever runs on the server.

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<WagmiConfigType | null>(null);

  React.useEffect(() => {
    // This code ONLY runs in the browser, after the component has mounted.
    
    // 1. Get projectID
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
      return;
    }

    // 2. Create wagmiConfig
    const metadata = {
      name: "Joshi's Share",
      description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
      url: 'https://app.firebase-studio.into-the-studio.dev/',
      icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
    };

    const chains = [baseSepolia];
    const wagmiConfig = createConfig(
      defaultConfig({
        chains,
        metadata,
        projectId,
      })
    );

    // 3. Create modal
    createWeb3Modal({
      ethersConfig: wagmiConfig,
      chains,
      projectId,
      enableAnalytics: true,
    });
    
    // Set the config in state to trigger a re-render
    setConfig(wagmiConfig);

  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Render children ONLY after the config has been initialized on the client.
  // Before that, we render null to prevent any server-side rendering issues.
  if (!config) {
    return null;
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
