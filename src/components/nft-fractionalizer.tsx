"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
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
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export function NFTFractionalizer() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const [nftContract, setNftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side after hydration
    if (showResult) {
      const url = new URL(window.location.href);
      url.hash = tokenId;
      setShareUrl(url.toString());
    }
  }, [showResult, tokenId]);

  const handleFractionalize = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to fractionalize an NFT.",
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

    if (!db) return;

    setIsLoading(true);
    
    const nftData = {
      userId: user.uid,
      nftContract,
      tokenId,
      createdAt: serverTimestamp(),
    };

    const collectionRef = collection(db, "fractionalizedNfts");

    addDoc(collectionRef, nftData)
      .then(() => {
        setShowResult(true);
      })
      .catch((error: any) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: {
            ...nftData,
            // serverTimestamp is not resolved on the client, so we remove it for the error
            createdAt: 'SERVER_TIMESTAMP' 
          },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    alert("Uniswap pool created! (Testnet)\nCheck Goerli Etherscan.");
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Fractionalize Any NFT
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          Turn 1 NFT → 10,000 tradable tokens in{" "}
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
              <span>Fractionalizing...</span>
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
            <strong className="text-white">10,000 $FRAC</strong> tokens.
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
  );
}
