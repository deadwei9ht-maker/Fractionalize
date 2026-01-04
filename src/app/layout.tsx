
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { getFirebaseConfig } from '@/firebase/config';
import { Providers } from '@/components/providers';

// This is a workaround for a metadata issue in Next.js.
// We are defining it here to avoid a build error.
export const dynamicMetadata: Metadata = {
  title: "Fractionalize",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        <Providers 
          firebaseConfig={firebaseConfig}
        >
          <div className="flex-grow">
            {children}
          </div>
        </Providers>
        <footer className="w-full p-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Brought To You By &quot;The House Of Joshi&quot;
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your wallet keys are never sent to our servers. All transactions require your explicit approval in your wallet. Uploaded documents for asset verification are stored securely.
          </p>
        </footer>
      </body>
    </html>
  );
}
