'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { askAlice } from '@/ai/flows/alice-flow';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function AskAlice() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ text: string; audio: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (response?.audio && audioRef.current) {
      audioRef.current.src = response.audio;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [response]);

  const handleAsk = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Query is empty',
        description: 'Please enter a question for Alice.',
      });
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const result = await askAlice({ query });
      if (result.audioResponse && result.textResponse) {
        setResponse({ text: result.textResponse, audio: result.audioResponse });
      } else {
        throw new Error('AI response was incomplete.');
      }
    } catch (error: any) {
      console.error('Error asking Alice:', error);
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: error.message || 'Could not get a response from Alice.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          Ask Alice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ask Alice</DialogTitle>
          <DialogDescription>
            Ask our AI assistant anything about NFTs, fractionalization, or the web3 world.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="alice-query"
            placeholder="e.g., What is an NFT?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            disabled={loading}
          />
          {loading && (
             <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
          )}
          {response && (
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">
                <p>{response.text}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAsk} disabled={loading}>
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Thinking...</span>
                </div>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ask
                </>
            )}
          </Button>
        </DialogFooter>
        <audio ref={audioRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
