'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Landmark, Upload, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function TokenizeAsset() {
  const [assetDescription, setAssetDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownershipFile, setOwnershipFile] = useState<File | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  
  const ownershipInputRef = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleOwnershipFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOwnershipFile(file);
    }
  };

  const handleIdentityFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdentityFile(file);
    }
  };

  const handleFractionalize = () => {
     if (!assetDescription.trim() || !ownershipFile || !identityFile) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide the asset description, proof of ownership, and proof of identity.',
        });
        return;
    }
    // This would be where we hook into the fractionalization contract
    // and upload files to a secure storage. For now, it's a placeholder.
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        toast({
            title: 'Fractionalization Initiated (Simulated)',
            description: 'Your real-world asset is being tokenized on the testnet.',
        });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenize a Real-World Asset
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          Upload proof of ownership for a real-world asset to tokenize it into tradable shares.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Document uploads are for simulation purposes. In a real application, these would be securely verified.
          </AlertDescription>
        </Alert>

        <Input
          id="asset-description"
          placeholder="Asset Description (e.g., 2023 Sports Car, Rolex Watch...)"
          value={assetDescription}
          onChange={(e) => setAssetDescription(e.target.value)}
          disabled={loading}
          className="rounded-lg border-border/50 bg-input text-base"
        />
        
        <input
          type="file"
          ref={ownershipInputRef}
          onChange={handleOwnershipFileChange}
          className="hidden"
          accept=".pdf,image/*"
        />
        <Button 
            variant="outline"
            onClick={() => ownershipInputRef.current?.click()}
            disabled={loading}
            className="w-full justify-center"
        >
            <Upload className="mr-2" />
            {ownershipFile ? `Ownership: ${ownershipFile.name}` : 'Upload Proof of Ownership'}
        </Button>

        <input
          type="file"
          ref={identityInputRef}
          onChange={handleIdentityFileChange}
          className="hidden"
          accept=".pdf,image/*"
        />
        <Button 
            variant="outline"
            onClick={() => identityInputRef.current?.click()}
            disabled={loading}
            className="w-full justify-center"
        >
            <Upload className="mr-2" />
            {identityFile ? `ID: ${identityFile.name}` : 'Upload Proof of Identity'}
        </Button>
        
        <Button
          onClick={handleFractionalize}
          disabled={loading || !ownershipFile || !identityFile || !assetDescription}
          className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
              <span>Initiating Tokenization...</span>
            </div>
          ) : (
            <>
              <Landmark className="mr-2" />
              Tokenize this Asset
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
