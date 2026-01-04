
'use server';
/**
 * @fileOverview An AI flow for generating images from text prompts and creating a unique ID.
 *
 * - generateArt - A function that calls the image generation model.
 * - GenerateArtInput - The input type for the generateArt function.
 * - GenerateArtOutput - The return type for the generateArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArtInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
});
export type GenerateArtInput = z.infer<typeof GenerateArtInputSchema>;

const GenerateArtOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
  joshiShareId: z.string().describe('A unique identifier for the generated art.'),
});
export type GenerateArtOutput = z.infer<typeof GenerateArtOutputSchema>;


const idGenPrompt = ai.definePrompt({
    name: 'artIdGenPrompt',
    input: { schema: GenerateArtInputSchema },
    prompt: `
        You are a unique ID generator for a digital art platform called "Fractionalize".
        Based on the user's art prompt and the current timestamp, create a short, memorable, and unique alphanumeric ID.
        The ID should start with 'FRAC-'.

        Art Prompt: {{{prompt}}}
        Timestamp: ${new Date().toISOString()}
    `,
});


const generateArtFlow = ai.defineFlow(
  {
    name: 'generateArtFlow',
    inputSchema: GenerateArtInputSchema,
    outputSchema: GenerateArtOutputSchema,
  },
  async (input) => {
    
    // 1. Generate the unique ID first.
    const idGenResponse = await idGenPrompt(input);
    const joshiShareId = idGenResponse.text;

    // 2. Generate the image with the ID in mind.
    const imageGenPrompt = `User prompt: "${input.prompt}". As part of the image, subtly incorporate abstract artistic elements inspired by the unique identifier: ${joshiShareId}. This is not a visible watermark, but a thematic influence.`;

    const { media } = await ai.generate({
        model: 'googleai/imagen-2.0-fast-generate-001',
        prompt: imageGenPrompt,
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed to produce an output.');
    }

    return { imageUrl, joshiShareId };
  }
);


export async function generateArt(input: GenerateArtInput): Promise<GenerateArtOutput> {
    return generateArtFlow(input);
}
