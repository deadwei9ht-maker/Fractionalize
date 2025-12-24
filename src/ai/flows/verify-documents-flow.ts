
'use server';
/**
 * @fileOverview An AI flow for verifying real-world asset documentation.
 *
 * - verifyDocuments - A function that calls the document verification model.
 * - VerifyDocumentsInput - The input type for the verifyDocuments function.
 * - VerifyDocumentsOutput - The return type for the verifyDocuments function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyDocumentsInputSchema = z.object({
  assetDescription: z.string().describe('A description of the real-world asset.'),
  ownershipProofDataUri: z
    .string()
    .describe(
      "A photo or PDF of the ownership document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  identityDataUri: z
    .string()
    .describe(
      "A photo of the user's identity document (e.g., driver's license), as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type VerifyDocumentsInput = z.infer<typeof VerifyDocumentsInputSchema>;

const VerifyDocumentsOutputSchema = z.object({
  verified: z.boolean().describe('Whether the documents passed verification.'),
  reason: z.string().describe('The reason for the verification outcome.'),
});
export type VerifyDocumentsOutput = z.infer<typeof VerifyDocumentsOutputSchema>;


const verificationPrompt = ai.definePrompt({
    name: 'verifyDocumentsPrompt',
    input: { schema: VerifyDocumentsInputSchema },
    output: { schema: VerifyDocumentsOutputSchema },
    prompt: `You are an AI verification agent for an asset fractionalization platform. Your task is to analyze the provided documents to determine if the user has a legitimate claim to the asset.

    Analyze the following:
    1.  **Identity Document**: {{media url=identityDataUri}}
    2.  **Ownership Document**: {{media url=ownershipProofDataUri}}
    3.  **Asset Description**: "{{assetDescription}}"

    **Verification Steps:**
    1.  Extract the name from the Identity Document.
    2.  Extract the name from the Ownership Document.
    3.  Compare the names. They must match exactly.
    4.  Check if the asset described in the Ownership Document matches the user's Asset Description.
    5.  Assess the overall legitimacy. Look for signs of tampering, mismatched information, or implausible claims.

    **Decision:**
    - If names match and the asset description is consistent with the ownership proof, set 'verified' to true and provide a success reason.
    - If there are any discrepancies (mismatched names, inconsistent asset details, signs of forgery), set 'verified' to false and provide a clear, concise reason for the failure.
    `,
});

const verifyDocumentsFlow = ai.defineFlow(
  {
    name: 'verifyDocumentsFlow',
    inputSchema: VerifyDocumentsInputSchema,
    outputSchema: VerifyDocumentsOutputSchema,
  },
  async (input) => {
    const { output } = await verificationPrompt(input);
    if (!output) {
      return {
        verified: false,
        reason: 'The AI model could not process the verification request.',
      };
    }
    return output;
  }
);

export async function verifyDocuments(input: VerifyDocumentsInput): Promise<VerifyDocumentsOutput> {
    return verifyDocumentsFlow(input);
}
