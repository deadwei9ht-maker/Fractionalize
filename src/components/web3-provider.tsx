
'use client';

import { WagmiConfig } from 'wagmi';
import * as React from 'react';

// This is the key change: We use a state to hold the config,
// which will be populated only on the client side.
let wagmiConfig: ReturnType<typeof import('@/lib/web3').createWagmiConfig> | null = null;

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    // This effect runs only in the browser
    async function init() {
      // Dynamically import the configuration code.
      // This ensures it's never bundled on the server.
      const { createWagmiConfig, initializeWeb3Modal } = await import('@/lib/web3');
      
      // Create the config and modal
      wagmiConfig = createWagmiConfig();
      initializeWeb3Modal(wagmiConfig);
      
      // Mark as initialized to trigger a re-render
      setInitialized(true);
    }
    
    if (!initialized) {
      init();
    }
  }, [initialized]);

  // Render nothing until the client-side initialization is complete.
  if (!initialized || !wagmiConfig) {
    return null;
  }

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
