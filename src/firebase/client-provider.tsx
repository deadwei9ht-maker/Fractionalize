
'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { Web3Provider } from '@/components/web3-provider';
import type { FirebaseOptions } from 'firebase/app';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
  walletConnectProjectId: string;
}

export function FirebaseClientProvider({
  children,
  firebaseConfig,
  walletConnectProjectId,
}: FirebaseClientProviderProps) {
  // This component acts as a client-side boundary.
  // It receives server-side config and initializes providers on the client.
  return (
    <FirebaseProvider firebaseConfig={firebaseConfig}>
      <Web3Provider projectId={walletConnectProjectId}>
        {children}
      </Web3Provider>
    </FirebaseProvider>
  );
}
