
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
import { useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type FractionalizedNft = {
  id: string;
  nftContract: string;
  tokenId: string;
  userId: string;
};

// NOTE: Using a hardcoded free Alchemy API key.
// In a real app, this should be a private environment variable.
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo';

const NFTListItem = ({ nft }: { nft: FractionalizedNft }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [metadataName, setMetadataName] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://base-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTMetadata?contractAddress=${nft.nftContract}&tokenId=${nft.tokenId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch metadata from Alchemy");
        }
        const data = await response.json();
        
        const image = data.media?.[0]?.gateway || data.metadata?.image;
        if (image) {
          setImageUrl(image.replace("ipfs://", "https://ipfs.io/ipfs/"));
        } else {
           setImageUrl("https://picsum.photos/seed/error/128/128");
        }
        setMetadataName(data.title || `Token ${nft.tokenId}`);
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        // Fallback image if metadata fetch fails
        setImageUrl("https://picsum.photos/seed/fallback/128/128");
        setMetadataName(`Token ${nft.tokenId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [nft.tokenId, nft.nftContract]);

  return (
    <div className="flex flex-col gap-2">
       <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={imageUrl || "https://picsum.photos/seed/placeholder/128/128"}
            alt={metadataName}
            fill
            sizes="(max-width: 768px) 33vw, 128px"
            className="object-cover"
            data-ai-hint="nft image"
            onError={() => setImageUrl("https://picsum.photos/seed/error/128/128")}
          />
        )}
      </div>
      <div className="text-sm">
        <p className="font-semibold truncate text-white" title={metadataName}>
          {metadataName}
        </p>
        <p className="text-xs text-accent">10,000 $SHARE-{nft.tokenId}</p>
      </div>
    </div>
  );
};

export function NFTList() {
  const { user } = useUser();
  const query = useMemo(() => {
    if (!user) return undefined;
    // This creates a query constraint to fetch documents where 'userId' is equal to the current user's UID.
    // This is crucial for security rules and for fetching only the relevant data.
    return ['userId', '==', user.uid] as const;
  }, [user]);
  
  const { data: nfts, loading } = useCollection<FractionalizedNft>(
    "fractionalizedNfts",
    {
      // The query constraint is passed here.
      // The `deps` array ensures the hook re-runs when the user object changes (e.g., on login/logout).
      query: query,
      deps: [user], 
    }
  );

  // If the user is not logged in, we don't need to show this component.
  if (!user) {
    return null;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
             </div>
          ))}
        </div>
      );
    }
  
    if (!nfts || nfts.length === 0) {
      return (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No tokens yet!</AlertTitle>
          <AlertDescription>
            You haven't fractionalized any NFTs. Use the form to get started.
          </AlertDescription>
        </Alert>
      );
    }

    return (
       <ScrollArea className="h-[250px] w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6 pr-4">
          {nfts.map((nft) => (
            <NFTListItem key={nft.id} nft={nft} />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    )
  }

  return (
    <Card className="w-full border-accent/20 bg-card/50">
      <CardHeader>
        <CardTitle>Your NFT Tokens</CardTitle>
        <CardDescription>
          A list of the NFTs you've turned into tradable tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
