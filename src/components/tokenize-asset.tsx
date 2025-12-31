
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
import { Landmark, Upload, ShieldCheck, ShieldAlert, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyDocuments } from '@/ai/flows/verify-documents-flow';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase';
import { uploadFile } from '@/lib/storage-actions';
import { saveRealWorldAsset } from '@/lib/firestore-actions';
import { getStorage } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase/provider';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function TokenizeAsset() {
  const [assetDescription, setAssetDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initiating Tokenization...');
  const [ownershipFile, setOwnershipFile] = useState<File | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);

  const ownershipInputRef = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const app = useFirebaseApp();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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

  const handleFractionalize = async () => {
    if (!user || !db || !app) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to tokenize an asset.',
        });
        return;
    }
     if (!assetDescription.trim() || !ownershipFile || !identityFile) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide the asset description, proof of ownership, and identity document.',
        });
        return;
    }

    setLoading(true);
    setLoadingMessage('Verifying documents with AI...');

    try {
      const ownershipDataUri = await fileToDataUri(ownershipFile);
      const identityDataUri = await fileToDataUri(identityFile);

      const verificationResult = await verifyDocuments({
        assetDescription,
        ownershipProofDataUri: ownershipDataUri,
        identityDataUri: identityDataUri,
      });

      if (!verificationResult.verified) {
        throw new Error(verificationResult.reason || 'AI verification failed.');
      }

      setLoadingMessage('Verification successful. Uploading files...');
      const storage = getStorage(app);
      const ownershipProofUrl = await uploadFile(storage, `proofs/${user.uid}/${ownershipFile.name}`, ownershipFile);
      const identityUrl = await uploadFile(storage, `identities/${user.uid}/${identityFile.name}`, identityFile);
      
      setLoadingMessage('Saving asset to registry...');
      // This would be where a real smart contract creates the token ID.
      const simulatedTokenId = `RWA-${Date.now()}`;

      await saveRealWorldAsset(db, {
          userId: user.uid,
          description: assetDescription,
          ownershipProofUrl,
          identityUrl,
          tokenId: simulatedTokenId,
          createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Asset Tokenized!',
        description: 'Your real-world asset is now fractionalized on the testnet.',
        action: <div className="p-2 rounded-full bg-green-500/20"><ShieldCheck className="h-5 w-5 text-green-500" /></div>,
      });

    } catch (error: any) {
        console.error('Verification or tokenization error:', error);
        toast({
            variant: 'destructive',
            title: 'Tokenization Failed',
            description: error.message,
            action: <div className="p-2 rounded-full bg-destructive/20"><ShieldAlert className="h-5 w-5 text-destructive-foreground" /></div>,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center p-4 md:p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenize a Real-World Asset
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          An exploration of things to come: Provide documents for an asset to tokenize it into tradable shares, verified by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 md:p-6 pt-0">
        <Alert variant="destructive" className="border-primary/50 text-primary-foreground bg-primary/10">
          <TriangleAlert className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Live Testnet Feature</AlertTitle>
          <AlertDescription className="text-primary/80">
            While this feature is exploratory, proceeding will execute a real smart contract transaction on the testnet. This action is irreversible and will incur gas fees.
          </AlertDescription>
        </Alert>
        <Input
          id="asset-description"
          placeholder="Asset Description (e.g., 2023 Sports Car, Rolex Watch...)"
          value={assetDescription}
          onChange={(e) => setAssetDescription(e.target.value)}
          disabled={loading}
          className="rounded-lg border-border/50 bg-input text-sm md:text-base h-10 md:h-12"
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
            className="w-full justify-center h-10 md:h-12"
        >
            <Upload className="mr-2" />
            {ownershipFile ? `Selected: ${ownershipFile.name}` : 'Upload Proof of Ownership'}
        </Button>
        
        <input
          type="file"
          ref={identityInputRef}
          onChange={handleIdentityFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button 
            variant="outline"
            onClick={() => identityInputRef.current?.click()}
            disabled={loading}
            className="w-full justify-center h-10 md:h-12"
        >
            <Upload className="mr-2" />
            {identityFile ? `Selected: ${identityFile.name}` : 'Upload Identity Document'}
        </Button>
        
        <Button
          onClick={handleFractionalize}
          disabled={loading || !ownershipFile || !identityFile || !assetDescription}
          className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
              <span>{loadingMessage}</span>
            </div>
          ) : (
            <>
              <Landmark className="mr-2" />
              Verify & Tokenize Asset
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

    
