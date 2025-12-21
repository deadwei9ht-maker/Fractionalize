
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// 2. Set up metadata
const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/', // origin must match your domain & subdomain
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

// 3. Create wagmi config
const chains = [baseSepolia];
const wagmiConfig = createConfig(
  defaultConfig({
    chains,
    metadata,
    projectId,
  })
);

// 4. Create modal
createWeb3Modal({
  ethersConfig: wagmiConfig,
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return <WagmiConfig config={wagmiConfig}>{mounted && children}</WagmiConfig>;
}
