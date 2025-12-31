
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FileText,
  ImageIcon,
  Landmark,
  Palette,
  Terminal,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

// Types
type FractionalizedNft = {
  id: string;
  nftContract: string;
  tokenId: string;
  userId: string;
  shareAmount: number;
};

type AiNft = {
  id: string;
  prompt: string;
  imageUrl: string;
  tokenId: string;
  userId: string;
};

type RealWorldAsset = {
  id: string;
  description: string;
  tokenId: string;
  userId: string;
  verificationSummary: string;
};

type CombinedAsset = (
  | ({ type: 'wallet' } & FractionalizedNft)
  | ({ type: 'ai' } & AiNft)
  | ({ type: 'rwa' } & RealWorldAsset)
) & { createdAt: string };


// NOTE: Using a hardcoded free Alchemy API key.
// In a real app, this should be a private environment variable.
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo';

const WalletNftItem = ({ nft }: { nft: FractionalizedNft }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [metadataName, setMetadataName] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://base-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTMetadata?contractAddress=${nft.nftContract}&tokenId=${nft.tokenId}`
        );
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const data = await response.json();
        const image = data.media?.[0]?.gateway || data.metadata?.image;
        setImageUrl(image ? image.replace('ipfs://', 'https://ipfs.io/ipfs/') : "https://picsum.photos/seed/error/128/128");
        setMetadataName(data.title || `Token ${nft.tokenId}`);
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
        setImageUrl('https://picsum.photos/seed/fallback/128/128');
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
         <Badge variant="secondary" className="absolute top-2 left-2 gap-1">
          <Palette className="h-3 w-3" />
          Wallet
        </Badge>
      </div>
      <div className="text-sm">
        <p className="font-semibold truncate text-white" title={metadataName}>
          {metadataName}
        </p>
        <p className="text-xs text-accent">
          {nft.shareAmount?.toLocaleString()} $SHARE-{nft.tokenId}
        </p>
      </div>
    </div>
  );
};

const AiNftItem = ({ nft }: { nft: AiNft }) => (
  <div className="flex flex-col gap-2">
     <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted">
                    <Image
                        src={nft.imageUrl}
                        alt={nft.prompt}
                        fill
                        sizes="(max-width: 768px) 33vw, 128px"
                        className="object-cover"
                        data-ai-hint="ai generated art"
                    />
                    <Badge variant="secondary" className="absolute top-2 left-2 gap-1">
                        <ImageIcon className="h-3 w-3" />
                        AI Art
                    </Badge>
                </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
                <p className="text-xs text-muted-foreground">Prompt:</p>
                <p>{nft.prompt}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <div className="text-sm">
      <p className="font-semibold truncate text-white" title={nft.prompt}>
        {nft.prompt}
      </p>
      <p className="text-xs text-accent font-mono">{nft.tokenId}</p>
    </div>
  </div>
);

const RwaItem = ({ asset }: { asset: RealWorldAsset }) => (
    <div className="flex flex-col gap-2">
     <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                     <Badge variant="secondary" className="absolute top-2 left-2 gap-1">
                        <Landmark className="h-3 w-3" />
                        Asset
                    </Badge>
                </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
                <p className="text-xs text-muted-foreground">AI Summary:</p>
                <p>{asset.verificationSummary}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <div className="text-sm">
      <p className="font-semibold truncate text-white" title={asset.description}>
        {asset.description}
      </p>
      <p className="text-xs text-accent font-mono">{asset.tokenId}</p>
    </div>
  </div>
);

export function TokenizedItemsList() {
  const { user } = useUser();

  const { data: nfts, loading: loadingNfts } = useCollection<FractionalizedNft>(
    'fractionalizedNfts',
    { query: useMemo(() => (user ? ['userId', '==', user.uid] : undefined), [user]), deps: [user] }
  );
  const { data: aiNfts, loading: loadingAiNfts } = useCollection<AiNft>(
    'aiNfts',
    { query: useMemo(() => (user ? ['userId', '==', user.uid] : undefined), [user]), deps: [user] }
  );
  const { data: realWorldAssets, loading: loadingRealWorld } = useCollection<RealWorldAsset>(
    'realWorldAssets',
    { query: useMemo(() => (user ? ['userId', '==', user.uid] : undefined), [user]), deps: [user] }
  );

  const combinedAssets = useMemo(() => {
    const allAssets: CombinedAsset[] = [];
    nfts?.forEach(item => allAssets.push({ ...item, type: 'wallet', createdAt: (item as any).createdAt }));
    aiNfts?.forEach(item => allAssets.push({ ...item, type: 'ai', createdAt: (item as any).createdAt }));
    realWorldAssets?.forEach(item => allAssets.push({ ...item, type: 'rwa', createdAt: (item as any).createdAt }));
    
    // Sort by creation date, newest first
    return allAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [nfts, aiNfts, realWorldAssets]);
  
  const loading = loadingNfts || loadingAiNfts || loadingRealWorld;

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

    if (combinedAssets.length === 0) {
      return (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No tokens yet!</AlertTitle>
          <AlertDescription>
            You haven't tokenized any assets. Use the forms to get started.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <ScrollArea className="h-[250px] w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6 pr-4">
          {combinedAssets.map(asset => {
            switch (asset.type) {
              case 'wallet': return <WalletNftItem key={asset.id} nft={asset} />;
              case 'ai': return <AiNftItem key={asset.id} nft={asset} />;
              case 'rwa': return <RwaItem key={asset.id} asset={asset} />;
              default: return null;
            }
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
  };

  return (
    <Card className="w-full border-accent/20 bg-card/50">
      <CardHeader>
        <CardTitle>Your Tokenized Asset Portfolio</CardTitle>
        <CardDescription>
          A unified list of all assets you've tokenized on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
