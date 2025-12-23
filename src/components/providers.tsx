
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
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseOptions } from 'firebase/app';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

type ProvidersProps = {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
  walletConnectProjectId: string;
};

// All of this config is static, so it can be defined once outside the component.
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
    // This dummy ID is required but not used; the real one is passed to createWeb3Modal.
    projectId: 'dummy-id', 
  })
);

export function Providers({ 
    children, 
    firebaseConfig, 
    walletConnectProjectId 
}: ProvidersProps) {
  // createWeb3Modal must be called only once and on the client side.
  if (typeof window !== 'undefined' && walletConnectProjectId) {
    createWeb3Modal({
      ethersConfig: wagmiConfig,
      chains,
      projectId: walletConnectProjectId,
      enableAnalytics: true,
    });
  }

  return (
    <FirebaseProvider firebaseConfig={firebaseConfig}>
        <WagmiConfig config={wagmiConfig}>
            <Header />
            {children}
            <Toaster />
            <FirebaseErrorListener />
        </WagmiConfig>
    </FirebaseProvider>
  );
}
