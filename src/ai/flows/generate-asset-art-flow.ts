'use server';
/**
 * @fileOverview An AI flow for generating a stylized image of a real-world asset.
 *
 * - generateAssetArt - A function that calls the image-to-image generation model.
 * - GenerateAssetArtInput - The input type for the generateAssetArt function.
 * - GenerateAssetArtOutput - The return type for the generateAssetArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAssetArtInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a real-world asset, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the asset.'),
});
export type GenerateAssetArtInput = z.infer<typeof GenerateAssetArtInputSchema>;

const GenerateAssetArtOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateAssetArtOutput = z.infer<typeof GenerateAssetArtOutputSchema>;


const generateAssetArtFlow = ai.defineFlow(
  {
    name: 'generateAssetArtFlow',
    inputSchema: GenerateAssetArtInputSchema,
    outputSchema: GenerateAssetArtOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        // Use a model capable of image-to-image generation
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: input.photoDataUri } },
            { text: `Create a highly stylized, futuristic, and artistic "digital twin" NFT of the following asset: ${input.description}. The style should be vibrant, with neon accents and a sleek, high-tech feel suitable for a digital collectible.` },
        ],
        config: {
            // Must specify that we expect both text and image in response for this model
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed to produce an output.');
    }

    return { imageUrl };
  }
);

export async function generateAssetArt(input: GenerateAssetArtInput): Promise<GenerateAssetArtOutput> {
    return generateAssetArtFlow(input);
}
