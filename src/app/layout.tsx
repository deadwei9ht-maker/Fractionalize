
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Web3Provider } from '@/components/web3-provider';
import { Header } from '@/components/header';
import { getFirebaseConfig } from '@/firebase/config';

export const metadata: Metadata = {
  title: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  // Get the fully resolved config on the server
  const firebaseConfig = getFirebaseConfig();

  // Ensure config is valid before rendering providers that depend on it
  const isConfigValid =
    walletConnectProjectId &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        {isConfigValid ? (
          <FirebaseProvider firebaseConfig={firebaseConfig}>
            <Web3Provider projectId={walletConnectProjectId}>
              <Header />
              {children}
              <Toaster />
              <FirebaseErrorListener />
            </Web3Provider>
          </FirebaseProvider>
        ) : (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <p className="text-foreground">Configuration is missing. The application cannot start.</p>
          </div>
        )}
      </body>
    </html>
  );
}
