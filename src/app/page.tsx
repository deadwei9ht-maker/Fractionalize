
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTFractionalizer } from '@/components/nft-fractionalizer';
import { NFTList } from '@/components/nft-list';
import { OwnedNfts, type OwnedNft } from '@/components/owned-nfts';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Home() {
  const [selectedNft, setSelectedNft] = useState<OwnedNft | null>(null);
  const { isConnected } = useAccount();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 pt-12">
      <div className="flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="w-full max-w-md">
          {isConnected ? (
            <NFTFractionalizer selectedNft={selectedNft} />
          ) : (
            <Card className="w-full max-w-md">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          )}
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
