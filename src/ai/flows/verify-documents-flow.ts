
'use server';
/**
 * @fileOverview An AI flow for verifying real-world asset documentation and extracting metadata.
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
  extractedName: z.string().describe("The full name extracted from the identity document."),
  extractedAssetDetails: z.string().describe("Key details about the asset extracted from the ownership document."),
  verificationSummary: z.string().describe("A summary of the verification process and findings.")
});
export type VerifyDocumentsOutput = z.infer<typeof VerifyDocumentsOutputSchema>;


const verificationPrompt = ai.definePrompt({
    name: 'verifyDocumentsPrompt',
    input: { schema: VerifyDocumentsInputSchema },
    output: { schema: VerifyDocumentsOutputSchema },
    prompt: `You are an AI verification agent for an asset fractionalization platform. Your task is to analyze the provided documents to determine if the user has a legitimate claim to the asset, and to extract key metadata.

    Analyze the following:
    1.  **Identity Document**: {{media url=identityDataUri}}
    2.  **Ownership Document**: {{media url=ownershipProofDataUri}}
    3.  **Asset Description**: "{{assetDescription}}"

    **Verification and Extraction Steps:**
    1.  **Extract Name**: Extract the full name from the Identity Document.
    2.  **Extract Asset Details**: Extract the core details of the asset from the Ownership Document (e.g., for a car: VIN, make, model; for a property: address, parcel number; for jewelry: item description, appraisal value).
    3.  **Compare**: Check if the name from the Identity Document appears on the Ownership Document.
    4.  **Assess Legitimacy**: Check if the asset described in the Ownership Document matches the user's Asset Description. Look for signs of tampering, mismatched information, or implausible claims.
    5.  **Summarize**: Provide a brief summary of your findings.

    **Decision and Output:**
    - If names match and the asset description is consistent, set 'verified' to true.
    - If there are discrepancies, set 'verified' to false.
    - Populate all output fields: 'verified', 'reason', 'extractedName', 'extractedAssetDetails', and 'verificationSummary' with your findings.
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
        extractedName: "N/A",
        extractedAssetDetails: "N/A",
        verificationSummary: "AI model failed to respond.",
      };
    }
    return output;
  }
);

export async function verifyDocuments(input: VerifyDocumentsInput): Promise<VerifyDocumentsOutput> {
    return verifyDocumentsFlow(input);
}
