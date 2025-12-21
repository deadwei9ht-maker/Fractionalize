
'use client';

import { WagmiConfig } from 'wagmi';
import * as React from 'react';
import type { WagmiConfig as WagmiConfigType } from 'wagmi';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<WagmiConfigType | null>(null);

  React.useEffect(() => {
    async function init() {
      const { createWagmiConfig, initializeWeb3Modal } = await import('@/lib/web3');
      const wagmiConfig = createWagmiConfig();
      initializeWeb3Modal(wagmiConfig);
      setConfig(wagmiConfig);
    }
    init();
  }, []);

  if (!config) {
    return null;
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
