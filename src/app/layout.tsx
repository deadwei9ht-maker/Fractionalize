import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Web3Provider } from '@/components/web3-provider';
import { Header } from '@/components/header';
import { firebaseConfig } from '@/firebase/config';

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

  if (!walletConnectProjectId) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we can throw to make it clear the variable is missing.
    throw new Error(
      'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in the environment.'
    );
  }

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
        <Web3Provider projectId={walletConnectProjectId}>
          <FirebaseProvider firebaseConfig={firebaseConfig}>
            <Header />
            {children}
            <Toaster />
            <FirebaseErrorListener />
          </FirebaseProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
