
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

const AVG_PRICE_PER_CREDIT_ETH = 0.004; // Based on the 5-credit pack
const DONATION_PERCENTAGE = 0.30; // 30%
const ETH_TO_USD_RATE = 3000; // Simulated exchange rate

export function DonationTracker() {
  const { user } = useUser();

  const { data: nfts, loading: loadingNfts } = useCollection('fractionalizedNfts');
  const { data: aiNfts, loading: loadingAiNfts } = useCollection('aiNfts');
  const { data: realWorldAssets, loading: loadingRealWorld } = useCollection('realWorldAssets');

  const totalTokenizations = useMemo(() => {
    const nftCount = nfts?.length || 0;
    const aiNftCount = aiNfts?.length || 0;
    const realWorldCount = realWorldAssets?.length || 0;
    return nftCount + aiNftCount + realWorldCount;
  }, [nfts, aiNfts, realWorldAssets]);

  const totalDonationEth = totalTokenizations * AVG_PRICE_PER_CREDIT_ETH * DONATION_PERCENTAGE;
  const totalDonationUsd = totalDonationEth * ETH_TO_USD_RATE;

  const loading = loadingNfts || loadingAiNfts || loadingRealWorld;

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full border-primary/30 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Heart className="text-primary" />
            Community-Powered Donations
        </CardTitle>
        <CardDescription>
          We're proud to pledge 30% of all tokenization credit sales to charitable causes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
        {loading ? (
            <div className="flex flex-col gap-2 items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-32" />
            </div>
        ) : (
            <>
                <p className="text-4xl font-bold text-primary">{totalDonationUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                <p className="text-sm text-muted-foreground">
                    Raised from {totalTokenizations.toLocaleString()} tokenizations ({totalDonationEth.toFixed(4)} ETH)
                </p>
            </>
        )}
      </CardContent>
    </Card>
  );
}
