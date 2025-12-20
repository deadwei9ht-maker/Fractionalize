"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/use-collection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type FractionalizedNft = {
  id: string;
  nftContract: string;
  tokenId: string;
  userId: string;
};

export function NFTList() {
  const { user } = useUser();
  const { data: nfts, loading } = useCollection<FractionalizedNft>(
    "fractionalizedNfts",
    {
      query: user ? ["userId", "==", user.uid] : undefined,
      deps: [user],
    }
  );

  if (!user) {
    return null;
  }
  
  if (loading) {
    return (
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle>Your Fractionalized NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No NFTs yet!</AlertTitle>
            <AlertDescription>
              You haven't fractionalized any NFTs. Use the form above to get started.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mt-8">
      <CardHeader>
        <CardTitle>Your Fractionalized NFTs</CardTitle>
        <CardDescription>
          Here is a list of the NFTs you've turned into tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {nfts.map((nft, index) => (
          <div
            key={nft.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-input p-3 gap-4"
          >
            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={`https://picsum.photos/seed/${nft.id}/64/64`}
                alt={`NFT ${nft.tokenId}`}
                width={64}
                height={64}
                className="object-cover"
                data-ai-hint="nft abstract"
              />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="font-mono text-sm truncate text-white" title={nft.nftContract}>{nft.nftContract}</p>
              <p className="text-xs text-muted-foreground">Token ID: {nft.tokenId}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
