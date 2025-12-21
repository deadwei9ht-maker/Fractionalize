
import { createWeb3Modal as createModal, defaultConfig } from '@web3modal/ethers5/react';
import { createConfig, type WagmiConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Please check your .env.local file.');
}

const metadata = {
  name: "Joshi's Share",
  description: 'Turn any NFT into 10,000 tradable shares in 1 click.',
  url: 'https://app.firebase-studio.into-the-studio.dev/',
  icons: ['https://app.firebase-studio.into-the-studio.dev/favicon.ico'],
};

const chains = [baseSepolia];

export function createWagmiConfig() {
    return createConfig(
        defaultConfig({
            chains,
            metadata,
            projectId,
        })
    );
}

export function initializeWeb3Modal(wagmiConfig: WagmiConfig) {
    createModal({
        ethersConfig: wagmiConfig,
        chains,
        projectId,
        enableAnalytics: true,
    });
}
