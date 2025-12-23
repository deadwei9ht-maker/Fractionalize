
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
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
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
  const firebaseConfig = getFirebaseConfig();

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
        <Providers
          firebaseConfig={firebaseConfig}
          walletConnectProjectId={walletConnectProjectId}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
