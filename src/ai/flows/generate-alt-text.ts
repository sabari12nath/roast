'use server';

/**
 * @fileOverview An AI agent that generates alt text for an image.
 *
 * - generateAltText - A function that generates alt text for an image.
 * - GenerateAltTextInput - The input type for the generateAltText function.
 * - GenerateAltTextOutput - The return type for the generateAltText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAltTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAltTextInput = z.infer<typeof GenerateAltTextInputSchema>;

const GenerateAltTextOutputSchema = z.object({
  altText: z.string().describe('The generated alt text for the image.'),
});
export type GenerateAltTextOutput = z.infer<typeof GenerateAltTextOutputSchema>;

export async function generateAltText(input: GenerateAltTextInput): Promise<GenerateAltTextOutput> {
  return generateAltTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAltTextPrompt',
  input: {schema: GenerateAltTextInputSchema},
  output: {schema: GenerateAltTextOutputSchema},
  prompt: `You are an expert in generating alt text for images. Generate a concise and descriptive alt text for the given image.

Image: {{media url=photoDataUri}}`,
});

const generateAltTextFlow = ai.defineFlow(
  {
    name: 'generateAltTextFlow',
    inputSchema: GenerateAltTextInputSchema,
    outputSchema: GenerateAltTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
