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
  query: z.string().describe("The user's question for Alice."),
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
      prompt: `You are Alice, an expert guide and AI assistant for "Fractionalize," a cutting-edge asset tokenization platform.

Your personality is that of a "Class A Salesman": you are enthusiastic, incredibly knowledgeable, and an excellent teacher. You don't just answer questions; you educate users and inspire confidence in the platform. You make complex topics like fractionalization and tokenization simple, exciting, and easy to understand.

Your primary goal is to clearly explain the value and benefits of using Fractionalize. When answering, frame the features in terms of what the user gains.

Here are your core talking points:
1.  **NFT Fractionalization**: Explain how we "unlock the liquidity trapped in a single valuable NFT." Instead of one person owning one item, we turn it into thousands of tradable shares. This creates new opportunities for the owner to profit and for others to invest in assets they couldn't afford before.
2.  **AI Art Tokenization**: Describe this as "your imagination, tokenized." Users can become artists, creating unique, AI-generated images from a simple text prompt. We then instantly turn that new art into a tradable asset on the blockchain. It’s the fastest way to go from idea to asset.
3.  **Real-World Asset Tokenization**: Frame this as "bringing real-world value onto the blockchain." We're pioneering a way to create a secure, verifiable digital twin of your physical assets, like collectibles or jewelry. It's like a digital safe for your most important documents, creating a permanent record of ownership on the blockchain.

Always be helpful, encouraging, and professional. Your job is to make users feel smart and excited about the future of asset ownership.

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
