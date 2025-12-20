'use client';

import { CheckCircle, Zap, Percent } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Pricing() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-white/80">
          No subscriptions. No hidden costs. Pay only for what you use.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col border-accent/30 bg-card/70 shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-accent" />
              Upfront Fee
            </CardTitle>
            <CardDescription>For fractionalizing your NFT.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-4xl font-bold">
              0.01 ETH
              <span className="text-base font-normal text-muted-foreground"> + Gas</span>
            </div>
            <p className="mt-4 text-muted-foreground">
              A one-time fee to cover the smart contract interaction and platform service for turning your NFT into 10,000 shares.
            </p>
          </CardContent>
          <CardContent>
             <ul className="flex flex-col gap-3 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>1-click fractionalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>10,000 liquid shares created</span>
                </li>
                 <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Shareable token page</span>
                </li>
              </ul>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col border-primary/30 bg-card/70 shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Percent className="h-6 w-6 text-primary" />
              Trading Fee
            </CardTitle>
            <CardDescription>On all token sales.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-4xl font-bold">2.5%</div>
            <p className="mt-4 text-muted-foreground">
              A small percentage fee is collected from the seller on every secondary market transaction of your NFT shares.
            </p>
          </CardContent>
           <CardContent>
             <ul className="flex flex-col gap-3 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Fee on secondary sales only</span>
                </li>
                 <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>We only win when you win</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Funds continued development</span>
                </li>
              </ul>
          </CardContent>
        </Card>
      </div>
       <div className="mt-4 w-full max-w-md">
         <Link href="/">
            <Button
                className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                Get Started Now
            </Button>
         </Link>
      </div>
    </div>
  );
}
