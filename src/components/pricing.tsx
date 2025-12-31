'use client';

import { CheckCircle, Zap, Percent, Bot, Landmark } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

export function Pricing() {
  const tiers = [
    {
      name: 'Fractionalize from Wallet',
      price: '0.005 ETH',
      description: 'For turning an existing NFT into tradable shares.',
      icon: Zap,
      features: [
        '1-click fractionalization',
        'Up to 10,000 liquid shares',
        'Shareable token page',
        'Instant liquidity potential',
      ],
      className: 'border-accent/30 shadow-[0_0_20px_hsl(var(--accent)/0.2)]',
      iconColor: 'text-accent',
    },
    {
      name: 'Tokenize AI Art',
      price: '0.008 ETH',
      description: 'Generate unique art with AI and instantly tokenize it.',
      icon: Bot,
      features: [
        'AI-powered image generation',
        'Your imagination, tokenized',
        'Creates a brand new asset',
        'Ready for fractionalization',
      ],
      className: 'border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.2)]',
      iconColor: 'text-primary',
    },
    {
        name: 'Tokenize Real-World Asset',
        price: '0.02 ETH',
        description: 'Create a digital twin of a physical asset, verified by AI.',
        icon: Landmark,
        features: [
            'AI document verification',
            'Securely link documents to token',
            'Creates verifiable ownership record',
            'Brings real-world value on-chain',
        ],
        className: 'border-accent/30 shadow-[0_0_20px_hsl(var(--accent)/0.2)] md:col-span-2 lg:col-span-1',
        iconColor: 'text-accent',
    }
  ];

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-white/80">
          No subscriptions. No hidden costs. Pay only for what you use.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col bg-card/70 ${tier.className}`}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <tier.icon className={`h-6 w-6 ${tier.iconColor}`} />
                    {tier.name}
                    </CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="text-4xl font-bold">
                    {tier.price}
                    <span className="text-base font-normal text-muted-foreground"> + Gas</span>
                    </div>
                     <ul className="mt-6 flex flex-col gap-3 text-left">
                        {tier.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardContent>
                     <Link href="/">
                        <Button
                            className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
                        >
                            Get Started
                        </Button>
                    </Link>
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
