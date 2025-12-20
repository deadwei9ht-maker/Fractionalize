import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Web3Provider } from '@/components/web3-provider';

export const metadata: Metadata = {
  title: 'NFT Fractionalizer',
  description: 'Turn any NFT into 10,000 tradable tokens in 1 click.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Web3Provider>
          <FirebaseProvider>
            {children}
            <Toaster />
            <FirebaseErrorListener />
          </FirebaseProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
