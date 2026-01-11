
'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { type FirebaseOptions } from 'firebase/app';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useEffect, useState, useRef } from 'react';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { WagmiConfig, createConfig, type State, useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { logWalletConnection } from '@/lib/firestore-actions';
import { useToast } from '@/hooks/use-toast';

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

// A separate component to contain the wagmi hooks
function WalletConnectionHandler({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  // Use a ref to track if the connection has already been logged for this session
  const hasLoggedConnection = useRef(false);

  useEffect(() => {
    if (isConnected && address && db && user && !hasLoggedConnection.current) {
        logWalletConnection(db, {
            walletAddress: address,
            userId: user.uid
        }).then(isFlagged => {
            if (isFlagged) {
                toast({
                    variant: 'destructive',
                    title: 'Wallet Flagged',
                    description: `Wallet ${address.slice(0, 6)}... has been flagged for unusual activity.`,
                });
            }
        });
        // Mark as logged for this session
        hasLoggedConnection.current = true;
    }
     // Reset the ref when the user disconnects
    if (!isConnected) {
        hasLoggedConnection.current = false;
    }
  }, [isConnected, address, db, user, toast]);

  return <>{children}</>;
}


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
      const errorMessage = 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please add it to your environment variables to enable wallet connections.';
      console.error(errorMessage);
      setError(errorMessage);
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
        <WalletConnectionHandler>
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </WalletConnectionHandler>
      </FirebaseProvider>
    </WagmiConfig>
  );
}

    