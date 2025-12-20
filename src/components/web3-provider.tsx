
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

// 1. Set up wagmi config
// Note: It's important to create the config outside the component.
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
});

const metadata = {
  name: 'Joshi Fragments',
  description: 'Turn any NFT into 10,000 tradable tokens in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};


export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    // 2. Get projectID and create modal
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
      return;
    }

    createWeb3Modal({
        ethersConfig: defaultConfig({
          metadata,
          defaultChainId: baseSepolia.id,
        }),
        chains: [baseSepolia],
        projectId,
        enableAnalytics: true,
      });
    
    setInitialized(true);
  }, [])

  // WagmiConfig should wrap the children. And we only render children after initialization.
  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
