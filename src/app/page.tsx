'use client';

import { useState } from 'react';
import { NFTFractionalizer } from '@/components/nft-fractionalizer';
import { NFTList } from '@/components/nft-list';
import { UserAuth } from '@/components/user-auth';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { OwnedNfts, type OwnedNft } from '@/components/owned-nfts';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const [selectedNft, setSelectedNft] = useState<OwnedNft | null>(null);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 pt-24">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <WalletConnectButton />
        <UserAuth />
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="w-full max-w-md">
          <NFTFractionalizer selectedNft={selectedNft} />
        </div>
        <Separator orientation="vertical" className="hidden h-auto lg:block" />
        <div className="flex w-full flex-col gap-8 lg:max-w-none lg:flex-1">
          <OwnedNfts onNftSelect={setSelectedNft} selectedNft={selectedNft} />
          <NFTList />
        </div>
      </div>
    </main>
  );
}
