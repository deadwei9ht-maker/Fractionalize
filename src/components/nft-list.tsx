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
import { Terminal } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type FractionalizedNft = {
  id: string;
  nftContract: string;
  tokenId: string;
  userId: string;
};

const NFTListItem = ({ nft }: { nft: FractionalizedNft }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Using a public gateway to fetch NFT metadata
        const metadataUrl = `https://ipfs.io/ipfs/bafybeiccfax36q2xqj2mopkvz47s53xdmvkapbkrkyq2iaykvqgcgweovi/${nft.tokenId}.json`;
        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const metadata = await metadataResponse.json();
        
        // Assuming the image URL is in a standard format
        const image = metadata.image || metadata.image_url;
        if (image) {
          // Replace ipfs:// protocol if present
          setImageUrl(image.replace("ipfs://", "https://ipfs.io/ipfs/"));
        } else {
           setImageUrl("https://picsum.photos/seed/error/64/64");
        }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        // Fallback image if metadata fetch fails
        setImageUrl("https://picsum.photos/seed/fallback/64/64");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [nft.tokenId]);

  return (
    <div
      key={nft.id}
      className="flex items-center justify-between rounded-lg border border-border/50 bg-input p-3 gap-4"
    >
      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={imageUrl || "https://picsum.photos/seed/placeholder/64/64"}
            alt={`NFT ${nft.tokenId}`}
            width={64}
            height={64}
            className="object-cover"
            data-ai-hint="nft image"
            onError={() => setImageUrl("https://picsum.photos/seed/error/64/64")}
          />
        )}
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="font-mono text-sm truncate text-white" title={nft.nftContract}>
          {nft.nftContract}
        </p>
        <p className="text-xs text-muted-foreground">Token ID: {nft.tokenId}</p>
      </div>
    </div>
  );
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
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
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
    <Card className="w-full max-w-md mt-8 border-accent/20 bg-card/50">
      <CardHeader>
        <CardTitle>Your Fractionalized NFTs</CardTitle>
        <CardDescription>
          Here is a list of the NFTs you've turned into tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {nfts.map((nft) => (
          <NFTListItem key={nft.id} nft={nft} />
        ))}
      </CardContent>
    </Card>
  );
}
