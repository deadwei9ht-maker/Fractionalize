
'use client';

import * as React from 'react';
import {
  createWeb3Modal,
  defaultConfig,
} from '@web3modal/ethers5/react';
import {
  WagmiConfig,
  createConfig,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

type Web3ProviderProps = {
  children: React.ReactNode;
  projectId: string;
};

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const chains = [baseSepolia];

// We create the config outside of the component to avoid re-creation on every render.
const wagmiConfig = createConfig(
  defaultConfig({
    chains,
    metadata,
    // This dummy ID is required by the function signature but is not used.
    // The actual projectId from props is passed to createWeb3Modal.
    projectId: 'dummy-id',
  })
);

export function Web3Provider({ children, projectId }: Web3ProviderProps) {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    // createWeb3Modal must be called on the client side.
    // We use useEffect to ensure this.
    if (projectId) {
      createWeb3Modal({
        ethersConfig: wagmiConfig,
        chains,
        projectId,
        enableAnalytics: true,
      });
      setInitialized(true);
    }
  }, [projectId]);

  // We render the children only after the modal has been initialized.
  return <WagmiConfig config={wagmiConfig}>{initialized ? children : null}</WagmiConfig>;
}
