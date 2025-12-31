'use server';
/**
 * @fileOverview An AI flow for a voice assistant named Alice.
 *
 * - askAlice - A function that takes a text query, gets a text response, and converts it to speech.
 * - AskAliceInput - The input type for the askAlice function.
 * - AskAliceOutput - The return type for the askAlice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const AskAliceInputSchema = z.object({
  query: z.string().describe('The user\'s question for Alice.'),
});
export type AskAliceInput = z.infer<typeof AskAliceInputSchema>;

const AskAliceOutputSchema = z.object({
  textResponse: z.string().describe('The text-based answer from Alice.'),
  audioResponse: z
    .string()
    .describe("A data URI of the generated speech. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type AskAliceOutput = z.infer<typeof AskAliceOutputSchema>;

export async function askAlice(input: AskAliceInput): Promise<AskAliceOutput> {
  return aliceFlow(input);
}

const aliceFlow = ai.defineFlow(
  {
    name: 'aliceFlow',
    inputSchema: AskAliceInputSchema,
    outputSchema: AskAliceOutputSchema,
  },
  async (input) => {
    // 1. Generate a text response from the user's query
    const llmResponse = await ai.generate({
      prompt: `You are Alice, a friendly and knowledgeable AI assistant for the "Joshi's Share" platform.

You specialize in explaining the platform's features, which include:
1.  **NFT Fractionalization**: Turning any NFT from a user's wallet into thousands of tradable shares.
2.  **AI Art Tokenization**: Generating new art from a text prompt and then fractionalizing it.
3.  **Real-World Asset Tokenization**: A cutting-edge feature for creating digital tokens backed by verified real-world assets like collectibles or jewelry.

Provide clear, concise, and accurate answers to the user's questions about these features, the web3 world, and how to use the Joshi's Share app.

User's Question: "${input.query}"`,
    });
    const textResponse = llmResponse.text;

    // 2. Convert the text response to speech
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // NOTE: Using a prebuilt voice. We'll call her Alice in the UI.
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: textResponse,
    });

    if (!media || !media.url) {
      throw new Error('Audio generation failed to produce an output.');
    }

    // 3. Convert the raw PCM audio data to WAV format
    const pcmData = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(pcmData);
    const audioResponse = 'data:audio/wav;base64,' + wavData;

    return { textResponse, audioResponse };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}
