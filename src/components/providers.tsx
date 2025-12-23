
'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { type FirebaseOptions } from 'firebase/app';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useEffect, useState } from 'react';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

interface ProvidersProps {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
}

// All configuration is now happening inside the component to ensure it only runs
// on the client side after the component mounts.

export function Providers({
  children,
  firebaseConfig,
}: ProvidersProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 1. Get projectID
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      // This error is now safely thrown only on the client side.
      throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
    }

    // 2. Create wagmiConfig
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
        projectId,
        enableCoinbase: true,
        defaultChainId: baseSepolia.id,
      })
    );

    // 3. Create modal
    createWeb3Modal({
      ethersConfig: wagmiConfig,
      chains,
      projectId,
      enableAnalytics: true,
    });
    
    setInitialized(true);
  }, []);

  // Render nothing until all client-side initializations are complete.
  if (!initialized) {
    return null;
  }

  return (
      <FirebaseProvider firebaseConfig={firebaseConfig}>
        <Header />
        {children}
        <Toaster />
        <FirebaseErrorListener />
      </FirebaseProvider>
  );
}
