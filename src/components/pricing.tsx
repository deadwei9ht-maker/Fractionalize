'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

const pricingTiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For individuals getting started',
    features: [
      'Fractionalize up to 3 NFTs',
      'Basic support',
      'Access to standard features',
    ],
    cta: 'Get Started',
    isPrimary: false,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For professionals and teams',
    features: [
      'Unlimited NFT fractionalization',
      'Priority support',
      'Advanced analytics',
      'Early access to new features',
    ],
    cta: 'Choose Pro',
    isPrimary: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'All Pro features',
      'Dedicated account manager',
      'Custom integrations',
      '24/7/365 support',
    ],
    cta: 'Contact Sales',
    isPrimary: false,
  },
];

export function Pricing() {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-5xl gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Pricing Plans
        </h1>
        <p className="text-lg text-white/80">
          Choose the plan that's right for you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              'flex flex-col border-accent/20 bg-card/50',
              tier.isPrimary && 'border-accent shadow-[0_0_30px_hsl(var(--accent)/0.3)]'
            )}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-6">
              <div className="text-4xl font-bold">{tier.price}
                {tier.name !== 'Enterprise' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
              </div>
              <ul className="flex flex-col gap-3 text-left">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  'w-full',
                  tier.isPrimary && 'bg-gradient-to-r from-accent to-primary text-primary-foreground'
                )}
                variant={tier.isPrimary ? 'default' : 'outline'}
              >
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
