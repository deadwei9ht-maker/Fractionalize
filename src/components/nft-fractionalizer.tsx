
"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { ethers } from "ethers";
import { useEthersProvider, useEthersSigner } from "@/hooks/use-ethers";

import { cn } from "@/lib/utils";
import { useUser } from "@/firebase/auth/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { UniswapDialog } from "./uniswap-dialog";
import type { OwnedNft } from "./owned-nfts";
import { saveFractionalizedNft } from "@/lib/firestore-actions";
import { useFirestore } from "@/firebase";

type NFTFractionalizerProps = {
  selectedNft?: OwnedNft | null;
};

// The user-provided contract address
const fractionalizerContractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// The ABI for the JoshiFractions contract
const fractionalizerAbi = [
  "function fractionalize(address _nftContractAddress, uint256 _nftTokenId)",
  "event NFTFractionalized(uint256 indexed newTokenId, address indexed nftContractAddress, uint256 indexed nftTokenId, address originalOwner, uint256 shareAmount)"
];

// A generic ABI for the approve function on any ERC721 NFT
const erc721Abi = [
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId)"
];

export function NFTFractionalizer({ selectedNft }: NFTFractionalizerProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const [nftContract, setNftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Fractionalizing...");
  const [isUniswapDialogOpen, setIsUniswapDialogOpen] = useState(false);
  const [newFractionTokenId, setNewFractionTokenId] = useState<string | null>(null);


  useEffect(() => {
    if (selectedNft) {
      setNftContract(selectedNft.contract.address);
      setTokenId(selectedNft.tokenId);
      setShowResult(false);
      setShareUrl("");
      setNewFractionTokenId(null);
    }
  }, [selectedNft]);

  useEffect(() => {
    // This effect runs only on the client-side after hydration
    if (showResult && newFractionTokenId) {
      const url = new URL(window.location.href);
      url.searchParams.set("token", newFractionTokenId);
      setShareUrl(url.toString());
    }
  }, [showResult, newFractionTokenId]);

  const handleFractionalize = async () => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to fractionalize an NFT.",
      });
      return;
    }
    if (!signer || !provider) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to fractionalize an NFT.",
      });
      return;
    }

    if (!nftContract.trim() || !tokenId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both the NFT Contract and Token ID fields.",
      });
      return;
    }

    setIsLoading(true);
    setShowResult(false);
    setNewFractionTokenId(null);

    try {
      // 1. Get contract instances
      const nft = new ethers.Contract(nftContract, erc721Abi, signer);
      const fractionalizer = new ethers.Contract(fractionalizerContractAddress, fractionalizerAbi, signer);

      // 2. Check for and request approval
      setLoadingMessage("Checking NFT approval...");
      const approvedAddress = await nft.getApproved(tokenId);
      if (approvedAddress.toLowerCase() !== fractionalizerContractAddress.toLowerCase()) {
        setLoadingMessage("Awaiting approval transaction...");
        const approvalTx = await nft.approve(fractionalizerContractAddress, tokenId);
        setLoadingMessage("Confirming approval...");
        await approvalTx.wait();
      }

      // 3. Call the fractionalize function
      setLoadingMessage("Executing fractionalization...");
      const fractionalizeTx = await fractionalizer.fractionalize(nftContract, tokenId);
      
      setLoadingMessage("Confirming fractionalization...");
      const receipt = await fractionalizeTx.wait();
      
      // 4. Find the event to get the new token ID
      const event = receipt.events?.find((e: ethers.Event) => e.event === 'NFTFractionalized');
      if (event && event.args) {
         const newId = event.args.newTokenId.toString();
         
         // 5. Save the record to Firestore
         setLoadingMessage("Saving record...");
         const nftData = {
           userId: user.uid,
           nftContract: nftContract,
           tokenId: newId, // We use the *new* ID from the event for our shares
           originalTokenId: tokenId,
           originalContract: nftContract,
           createdAt: new Date().toISOString(),
         };
         await saveFractionalizedNft(db, nftData);

         setNewFractionTokenId(newId);
         setShowResult(true);
         toast({
            title: "Success!",
            description: `Your NFT is now 10,000 $SHARE-${newId} tokens.`,
         });
      } else {
        throw new Error("Could not find NFTFractionalized event in transaction receipt.");
      }

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.reason || error.message || "An unknown error occurred.",
      });
      setShowResult(false);
    } finally {
      setIsLoading(false);
      setLoadingMessage("Fractionalizing...");
    }
  };

  const handleCopyToClipboard = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Shareable link copied to clipboard.",
    });
  };

  const handleAddToUniswap = () => {
    setIsUniswapDialogOpen(true);
  };
  
  const handleUniswapConfirm = () => {
    setIsUniswapDialogOpen(false);
    toast({
      title: "Uniswap Pool Created! (Testnet)",
      description: `Liquidity pool for $SHARE-${newFractionTokenId} is now live.`,
    });
  };

  const displayTokenId = newFractionTokenId || tokenId;

  return (
    <>
      <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Fractionalize Any NFT
          </CardTitle>
          <CardDescription className="pt-2 text-white/80">
            Turn 1 NFT → 10,000 tradable shares in{" "}
            <strong className="text-white">1 click</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            id="nft"
            placeholder="NFT Contract (0x...)"
            value={nftContract}
            onChange={(e) => setNftContract(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-lg border-border/50 bg-input text-base"
          />
          <Input
            type="text"
            id="id"
            placeholder="Token ID (e.g., 42)"
            value={tokenId}
            onChange={(e) => {
              const val = e.target.value;
              // Only allow digits
              if (/^\d*$/.test(val)) {
                setTokenId(val);
              }
            }}
            disabled={isLoading}
            className="h-12 rounded-lg border-border/50 bg-input text-base"
          />
          <Button
            id="go"
            onClick={handleFractionalize}
            disabled={isLoading || showResult}
            className={cn(
              "h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]",
              !showResult && "animate-pulse"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                <span>{loadingMessage}</span>
              </div>
            ) : (
              "Fractionalize Now"
            )}
          </Button>
        </CardContent>

        {showResult && (
          <CardFooter className="mt-2 flex flex-col items-center gap-4 rounded-b-[20px] bg-accent/10 p-6">
            <p className="text-center">
              Success! Your NFT is now{" "}
              <strong className="text-white">10,000 $SHARE-{displayTokenId}</strong> tokens.
            </p>
            <div className="flex w-full items-center justify-center rounded-lg bg-background p-2">
              {shareUrl ? (
                <>
                  <span className="truncate text-sm text-accent" title={shareUrl}>
                    {shareUrl}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="ml-2 shrink-0">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                </>
              ) : (
                <Skeleton className="h-8 w-full" />
              )}
            </div>
            <Button
              id="uniswap"
              onClick={handleAddToUniswap}
              variant="secondary"
              className="w-full"
            >
              Add to Uniswap (Testnet)
            </Button>
          </CardFooter>
        )}
      </Card>
      <UniswapDialog 
        open={isUniswapDialogOpen}
        onOpenChange={setIsUniswapDialogOpen}
        onConfirm={handleUniswapConfirm}
        tokenId={displayTokenId}
      />
    </>
  );
}
