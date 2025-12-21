'use client';

import * as React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type WagmiConfig as WagmiConfigType } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// This is the definitive, correct implementation for a client-side only provider in Next.js.
// It ensures that no window/browser-specific code ever runs on the server.

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<WagmiConfigType | null>(null);

  React.useEffect(() => {
    // This code ONLY runs in the browser, after the component has mounted.
    
    // 1. Get projectID from client-side environment variables
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      // Throw an error that will be caught by the browser, not the server.
      throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please check your .env file.");
    }

    // 2. Create wagmiConfig
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

  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Render children ONLY after the config has been initialized on the client.
  // Before that, we render null to prevent any server-side rendering of child components
  // that might depend on the Web3 context.
  if (!config) {
    return null;
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
