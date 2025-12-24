
'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { type FirebaseOptions } from 'firebase/app';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useEffect, useState } from 'react';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type State } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

interface ProvidersProps {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
}

const chains = [baseSepolia];
const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

export function Providers({
  children,
  firebaseConfig,
}: ProvidersProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wagmiConfig, setWagmiConfig] = useState<State | undefined>(undefined);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

    if (!projectId) {
      console.error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please set it in your environment.');
      setError('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please add it to your environment variables to enable wallet connections.');
      return;
    }

    const config = createConfig(
      defaultConfig({
        chains,
        metadata,
        projectId,
        enableCoinbase: true,
        defaultChainId: baseSepolia.id,
      })
    );
    setWagmiConfig(config);
    
    createWeb3Modal({
      ethersConfig: config,
      chains,
      projectId,
      enableAnalytics: true,
    });
    
    setInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border border-destructive bg-card p-8 text-center shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-destructive-foreground">Configuration Error</h1>
          <p className="max-w-md text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!initialized || !wagmiConfig) {
    return null; // Render nothing until initialization is complete and successful
  }

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
}
