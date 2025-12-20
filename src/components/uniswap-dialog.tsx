
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Droplets } from 'lucide-react';

type UniswapDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  tokenId: string;
};

export function UniswapDialog({ open, onOpenChange, onConfirm, tokenId }: UniswapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-accent shadow-[0_0_30px_hsl(var(--accent)/0.2)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="text-accent" />
            Create Liquidity Pool
          </DialogTitle>
          <DialogDescription>
            You're about to create a new liquidity pool on the Base Sepolia testnet for your tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-muted-foreground">You are supplying:</p>
            <p className="font-semibold text-white">10,000 $FRAC-{tokenId}</p>
            <p className="font-semibold text-white">+ 1 ETH (Testnet)</p>
          </div>
          <div className="text-xs text-muted-foreground/80">
            This action will create a new trading pair on Uniswap, allowing anyone to buy and sell your fractionalized NFT tokens.
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm} className="bg-gradient-to-r from-accent to-primary text-primary-foreground">
            <Globe className="mr-2 h-4 w-4" />
            Confirm on Testnet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
