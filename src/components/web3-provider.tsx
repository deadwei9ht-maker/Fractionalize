
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
});

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    // Use the user's project ID if available, otherwise fall back to a public demo ID.
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e4c77c9f1acde4739414ab60742f1f61";
    if (!projectId) {
      // This case should not be reached with the fallback in place.
      console.error('WalletConnect Project ID is not set.');
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
  }, []);

  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
