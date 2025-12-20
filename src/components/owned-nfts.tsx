'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Wallet, Info } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// NOTE: Using a hardcoded free Alchemy API key.
// In a real app, this should be a private environment variable.
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo';

export type OwnedNft = {
  contract: {
    address: string;
  };
  tokenId: string;
  media: {
    gateway: string;
  }[];
  title: string;
};

type OwnedNftsProps = {
  onNftSelect: (nft: OwnedNft) => void;
  selectedNft?: OwnedNft | null;
};

export function OwnedNfts({ onNftSelect, selectedNft }: OwnedNftsProps) {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNfts = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);
      setNfts([]);

      try {
        const response = await fetch(
          `https://eth-goerli.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs?owner=${address}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch NFTs');
        }
        const data = await response.json();
        setNfts(data.ownedNfts);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address) {
      fetchNfts();
    } else {
      setNfts([]);
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md border-accent/20 bg-card/50 mb-8">
        <CardHeader>
          <CardTitle>Your Wallet NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <AlertDescription>
              Connect your wallet to see your NFTs here.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-accent/20 bg-card/50 mb-8">
      <CardHeader>
        <CardTitle>Your Wallet NFTs</CardTitle>
        <CardDescription>
          Click an NFT to select it for fractionalization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {error && (
           <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Could not load NFTs</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {!loading && !error && nfts.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No NFTs Found</AlertTitle>
            <AlertDescription>
              We couldn't find any NFTs in your wallet on the Goerli network.
            </AlertDescription>
          </Alert>
        )}
        {!loading && nfts.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <button
                key={`${nft.contract.address}-${nft.tokenId}`}
                className={cn(
                  'relative aspect-square w-full rounded-md overflow-hidden bg-muted transition-all duration-200',
                  'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                  selectedNft?.tokenId === nft.tokenId && selectedNft?.contract.address === nft.contract.address && 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                )}
                onClick={() => onNftSelect(nft)}
              >
                <Image
                  src={nft.media[0]?.gateway || "https://picsum.photos/seed/placeholder/128/128"}
                  alt={nft.title || 'NFT Image'}
                  fill
                  sizes="(max-width: 768px) 33vw, 128px"
                  className="object-cover"
                  data-ai-hint="nft owned"
                />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
