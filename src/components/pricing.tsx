
'use client';

import { CheckCircle, Zap, Percent, Bot, Landmark, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

export function Pricing() {
  const creditTiers = [
    {
      name: 'Single Credit',
      credits: 1,
      pricePerCredit: 0.01,
      totalPrice: 0.01,
      description: 'Pay as you go.',
      bestValue: false,
    },
    {
      name: 'Starter Pack',
      credits: 3,
      pricePerCredit: 0.009,
      totalPrice: 0.027,
      description: '10% discount per tokenization.',
      bestValue: false,
    },
    {
      name: 'Pro Pack',
      credits: 5,
      pricePerCredit: 0.008,
      totalPrice: 0.04,
      description: '20% discount per tokenization.',
      bestValue: true,
    },
    {
      name: 'Power User',
      credits: 7,
      pricePerCredit: 0.0075,
      totalPrice: 0.0525,
      description: '25% discount per tokenization.',
      bestValue: false,
    },
    {
        name: 'Enterprise',
        credits: 10,
        pricePerCredit: 0.007,
        totalPrice: 0.07,
        description: '30% discount per tokenization.',
        bestValue: false,
    }
  ];

  const services = [
    {
        name: 'Fractionalize from Wallet',
        icon: Zap,
        description: 'Turn any existing NFT into thousands of tradable shares.'
    },
    {
        name: 'Tokenize AI Art',
        icon: Bot,
        description: 'Generate unique art and instantly create a new asset.'
    },
    {
        name: 'Tokenize Real-World Asset',
        icon: Landmark,
        description: 'Create a secure, verifiable digital twin of a physical asset.'
    },
  ]

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-12 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenization Credit Packages
        </h1>
        <p className="text-lg text-white/80">
          Buy credits in bulk and save. Use credits for any tokenization service.
        </p>
      </div>
      
      <Card className="w-full bg-card/70 border-accent/30 shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
        <CardHeader>
            <CardTitle>What can I do with one credit?</CardTitle>
            <CardDescription>One credit gives you one tokenization of any type. Your credits never expire.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {services.map(service => (
                <div key={service.name} className="flex items-start gap-4 rounded-lg p-4 bg-background">
                    <service.icon className="h-8 w-8 mt-1 text-accent" />
                    <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {creditTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col bg-card/70 relative overflow-hidden ${tier.bestValue ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.3)]' : 'border-accent/30'}`}>
            {tier.bestValue && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg">BEST VALUE</div>
            )}
            <CardHeader className="flex-grow">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="text-4xl font-bold">
                {tier.credits}
                <span className="text-lg font-normal text-muted-foreground"> Credit{tier.credits > 1 ? 's' : ''}</span>
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-3xl font-bold">{tier.totalPrice.toFixed(4)}<span className="text-xl font-normal"> ETH</span></p>
                {tier.credits > 1 && (
                    <p className="text-sm text-muted-foreground">{tier.pricePerCredit.toFixed(4)} ETH / credit</p>
                )}
              </div>
              <Button
                className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <Package className="mr-2"/>
                Purchase
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="mt-4 w-full grid grid-cols-1 gap-8 md:px-16">
         <Card className="flex flex-col border-border/20 bg-card/50 md:flex-row md:items-center">
          <CardHeader className="flex-1">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl md:justify-start">
              <Percent className="h-6 w-6 text-muted-foreground" />
              Platform Fee
            </CardTitle>
            <CardDescription className="md:text-left">A small fee to support the platform, charged only on successful sales.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6 md:p-6">
            <div className="text-4xl font-bold">2.5%</div>
            <p className="mt-1 text-muted-foreground">
              On all secondary market trades.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
