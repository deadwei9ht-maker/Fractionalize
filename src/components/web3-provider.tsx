
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import * as React from 'react';

// The project ID is defined directly here. In a real-world scenario, this should
// still be loaded from environment variables, but the check and usage must be
// strictly client-side.
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// The wagmiConfig is created here, but it will only be used inside the provider
// which will ensure it's client-side.
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please check your .env.local file.');
}

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const chains = [baseSepolia];

const wagmiConfig = createConfig({
  chains,
  ...defaultConfig({
    metadata,
    chains,
    projectId: projectId, 
  }),
});

// The modal is created here, but again, its use is deferred to the client.
createWeb3Modal({
  ethersConfig: wagmiConfig,
  chains,
  projectId: projectId,
  enableAnalytics: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // This state ensures that we only render the children on the client side.
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(true);
  }, []);

  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
