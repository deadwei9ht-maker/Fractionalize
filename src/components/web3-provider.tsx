
'use client';

import { createWeb3Modal } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { baseSepolia } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import * as React from 'react';

// 1. Get ProjectID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e4c77c9f1acde4739414ab60742f1f61";
if (!projectId) {
  console.error('WalletConnect Project ID is not set.');
}

// 2. Configure wagmi client
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    walletConnect({ projectId, metadata, chains, options: {} }),
    injected({ chains, options: { shimDisconnect: true } }),
  ],
  publicClient,
  webSocketPublicClient,
});


// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  enableAnalytics: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(true);
  }, []);

  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
