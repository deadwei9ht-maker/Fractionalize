
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

// 1. Get ProjectID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  // Using a default public project ID as a fallback.
  // It's highly recommended to get your own project ID from https://cloud.walletconnect.com
  console.warn("WalletConnect Project ID is not set. Using a default public ID.");
}

// 2. Configure wagmi client
const chains = [baseSepolia];

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const wagmiConfig = defaultConfig({
  metadata,
  chains,
  projectId: projectId || 'e4c77c9f1acde4739414ab60742f1f61', // Fallback ID
});

// 3. Create modal
createWeb3Modal({
  ethersConfig: wagmiConfig,
  chains,
  projectId: projectId || 'e4c77c9f1acde4739414ab60742f1f61', // Fallback ID
  enableAnalytics: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // The initialized state is used to prevent hydration errors.
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(true);
  }, []);

  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
