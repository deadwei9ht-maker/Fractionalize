
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

export function Providers({
  children,
  firebaseConfig,
}: ProvidersProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (walletConnectProjectId) {
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
          projectId: walletConnectProjectId,
          enableCoinbase: true,
          defaultChainId: baseSepolia.id,
        })
      );

      createWeb3Modal({
        ethersConfig: wagmiConfig,
        chains,
        projectId: walletConnectProjectId,
        enableAnalytics: true,
      });
      
      setInitialized(true);
    }
  }, []);

  const renderContent = () => {
    if (!initialized) {
      // You can return a loader here if you want.
      // Returning null for now to avoid rendering anything before initialization.
      return null;
    }
    
    // WagmiConfig must be defined here, inside the client-only effect
    // We can't use the one from the outer scope as it would be created on the server
    const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
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
        projectId: walletConnectProjectId,
        enableCoinbase: true,
        defaultChainId: baseSepolia.id,
      })
    );


    return (
      <WagmiConfig config={wagmiConfig}>
        <FirebaseProvider firebaseConfig={firebaseConfig}>
          <Header />
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseProvider>
      </WagmiConfig>
    );
  };

  return <>{renderContent()}</>;
}
