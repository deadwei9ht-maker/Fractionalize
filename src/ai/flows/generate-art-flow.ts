
'use server';
/**
 * @fileOverview An AI flow for generating images from text prompts.
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
});
export type GenerateArtOutput = z.infer<typeof GenerateArtOutputSchema>;


const generateArtFlow = ai.defineFlow(
  {
    name: 'generateArtFlow',
    inputSchema: GenerateArtInputSchema,
    outputSchema: GenerateArtOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        // Using Imagen 2 for high-quality image generation.
        // NOTE: Student projects may need to use a different model based on availability/cost.
        model: 'googleai/imagen-2.0-fast-generate-001',
        prompt: input.prompt,
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed to produce an output.');
    }

    return { imageUrl };
  }
);


export async function generateArt(input: GenerateArtInput): Promise<GenerateArtOutput> {
    return generateArtFlow(input);
}
