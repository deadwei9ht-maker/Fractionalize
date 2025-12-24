
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
import { ImageIcon, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAssetArt } from '@/ai/flows/generate-asset-art-flow';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export function TokenizeAsset() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Description is empty',
        description: 'Please describe your asset.',
      });
      return;
    }
    if (!selectedFile || !previewImage) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload a photo of your asset.',
      });
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateAssetArt({
        description,
        photoDataUri: previewImage,
       });

      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
          title: 'Digital Twin Generated!',
          description: 'Your new masterpiece is ready to be tokenized.',
        });
      } else {
        throw new Error('Image generation failed to return a URL.');
      }
    } catch (error: any) {
      console.error('Error generating art:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate image.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFractionalize = () => {
    toast({
      title: 'Fractionalization Initiated (Simulated)',
      description: 'Your real-world asset is being tokenized on the testnet.',
    });
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenize an Asset
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          Upload a picture of a real-world item and generate a unique digital
          twin to tokenize.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          id="asset-description"
          placeholder="e.g., My 2021 Honda Civic, VIN #..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className="rounded-lg border-border/50 bg-input text-base"
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full justify-center"
        >
            <Upload className="mr-2" />
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload Photo'}
        </Button>
        
        {previewImage && !generatedImage && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <Image src={previewImage} alt="Asset preview" fill className="object-contain" />
            </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading || !selectedFile}
          className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
              <span>Generating Digital Twin...</span>
            </div>
          ) : (
            <>
              <Sparkles className="mr-2" />
              Generate Digital Twin
            </>
          )}
        </Button>

        {(loading || generatedImage) && (
          <div className="mt-4 flex flex-col gap-4 items-center">
            <div className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden bg-muted">
              {loading && !generatedImage && (
                <Skeleton className="h-full w-full" />
              )}
              {generatedImage && (
                <Image
                  src={generatedImage}
                  alt={description}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint="generated asset"
                />
              )}
            </div>
            {generatedImage && !loading && (
              <Button onClick={handleFractionalize} className="w-full">
                <ImageIcon className="mr-2" />
                Fractionalize this Asset
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
