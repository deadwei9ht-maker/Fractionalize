
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
import { Badge } from './ui/badge';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase';
import { saveAiNft } from '@/lib/firestore-actions';


export function TokenizeArt() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [joshiShareId, setJoshiShareId] = useState<string | null>(null);
  const [isFractionalizing, setIsFractionalizing] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

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
    setJoshiShareId(null);
    try {
      const result = await generateArt({ prompt });
      if (result.imageUrl && result.joshiShareId) {
        setGeneratedImage(result.imageUrl);
        setJoshiShareId(result.joshiShareId);
        toast({
          title: 'Art Generated!',
          description: 'Your new masterpiece is ready to be tokenized.',
        });
      } else {
        throw new Error('Image generation failed to return a URL or ID.');
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

  const handleFractionalize = async () => {
    if (!user || !db) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please log in to tokenize your art.",
        });
        return;
    }
    if (!generatedImage || !joshiShareId) {
        toast({
            variant: "destructive",
            title: "No Art to Tokenize",
            description: "Please generate an image first.",
        });
        return;
    }

    setIsFractionalizing(true);
    try {
        await saveAiNft(db, {
            userId: user.uid,
            prompt: prompt,
            imageUrl: generatedImage,
            tokenId: joshiShareId,
            createdAt: new Date().toISOString(),
        });

        toast({
            title: 'Success!',
            description: `Your AI art (${joshiShareId}) has been tokenized and saved to your portfolio.`,
        });

        // Reset the form after successful tokenization
        setPrompt('');
        setGeneratedImage(null);
        setJoshiShareId(null);
    } catch (error: any) {
        console.error('Error saving AI NFT:', error);
        toast({
            variant: "destructive",
            title: "Tokenization Failed",
            description: error.message || "Could not save the tokenized art.",
        });
    } finally {
        setIsFractionalizing(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-accent bg-card shadow-[0_0_30px_hsl(var(--accent)/0.3)] rounded-[20px]">
      <CardHeader className="text-center p-4 md:p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Tokenize AI Art
        </CardTitle>
        <CardDescription className="pt-2 text-white/80">
          Describe an image, generate it with AI, and tokenize it into 10,000
          shares.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 md:p-6 pt-0">
        <Textarea
          id="art-prompt"
          placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading || isFractionalizing}
          className="min-h-[80px] rounded-lg border-border/50 bg-input text-sm md:text-base"
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || isFractionalizing || !!generatedImage}
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
             {joshiShareId && !loading && (
               <div className="flex flex-col gap-2 w-full items-center">
                  <Badge variant="secondary" className="font-mono">{joshiShareId}</Badge>
               </div>
            )}
            {generatedImage && !loading && (
              <Button onClick={handleFractionalize} disabled={isFractionalizing} className="w-full h-10">
                 {isFractionalizing ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Tokenizing...</span>
                    </div>
                 ) : (
                    <>
                        <ImageIcon className="mr-2" />
                        Tokenize this Art
                    </>
                 )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
