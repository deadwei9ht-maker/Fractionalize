
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ImageIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateArt } from '@/ai/flows/generate-art-flow';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export function TokenizeArt() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a description for the art you want to create.',
      });
      return;
    }
    setLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateArt({ prompt });
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
          title: 'Art Generated!',
          description: 'Your new masterpiece is ready.',
        });
      } else {
        throw new Error('Image generation failed to return a URL.');
      }
    } catch (error: any) {
      console.error('Error generating art:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate image from prompt.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFractionalize = () => {
    // This would be where we hook into the fractionalization contract.
    // For now, it's a placeholder.
    toast({
      title: 'Fractionalization Initiated (Simulated)',
      description: 'Your AI-generated art is being tokenized on the testnet.',
    });
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenize AI Art
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          Describe an image, generate it with AI, and tokenize it into 10,000
          shares.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          id="art-prompt"
          placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="min-h-[80px] rounded-lg border-border/50 bg-input text-base"
        />
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="h-12 w-full rounded-lg bg-gradient-to-r from-accent to-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <>
              <Sparkles className="mr-2" />
              Generate Art
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
                  alt={prompt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint="generated art"
                />
              )}
            </div>
            {generatedImage && !loading && (
              <Button onClick={handleFractionalize} className="w-full">
                <ImageIcon className="mr-2" />
                Fractionalize this Art
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
