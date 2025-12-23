
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
  walletConnectProjectId: string;
}

export function Providers({
  children,
  firebaseConfig,
  walletConnectProjectId,
}: ProvidersProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
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
  }, [walletConnectProjectId]);

  // WagmiConfig needs to be created before it's used.
  // We create a dummy one for the initial render.
  const dummyConfig = createConfig(defaultConfig({
    chains: [baseSepolia],
    projectId: '1',
    metadata: { name: '', description: '', url: '', icons: [''] }
  }));


  return (
    <WagmiConfig config={initialized ? (undefined as any) : dummyConfig}>
      <FirebaseProvider firebaseConfig={firebaseConfig}>
        {initialized ? (
          <>
            <Header />
            {children}
            <Toaster />
            <FirebaseErrorListener />
          </>
        ) : null}
      </FirebaseProvider>
    </WagmiConfig>
  );
}
