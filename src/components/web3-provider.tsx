
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type WagmiConfig as WagmiConfigType } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<WagmiConfigType | null>(null);

  React.useEffect(() => {
    // This code will only run on the client side.
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('Error: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please check your .env.local file.');
      return;
    }

    const metadata = {
      name: "Joshi's Share",
      description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
      url: 'https://app.firebase-studio.into-the-studio.dev/', // origin must match your domain & subdomain
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

    createWeb3Modal({
      ethersConfig: wagmiConfig,
      chains,
      projectId,
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
    });

    setConfig(wagmiConfig);
  }, []);

  if (!config) {
    // Render nothing until the client-side configuration is ready.
    return null;
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
