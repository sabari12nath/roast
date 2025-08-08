'use server';

/**
 * @fileOverview An AI agent that predicts the perceived gender from an image.
 *
 * - predictGender - A function that predicts the perceived gender from an image.
 * - PredictGenderInput - The input type for the predictGender function.
 * - PredictGenderOutput - The return type for the predictGender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictGenderInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PredictGenderInput = z.infer<typeof PredictGenderInputSchema>;

const PredictGenderOutputSchema = z.object({
  gender: z
    .enum(['Male', 'Female', 'Uncertain'])
    .describe('The predicted gender.'),
});
export type PredictGenderOutput = z.infer<typeof PredictGenderOutputSchema>;

export async function predictGender(
  input: PredictGenderInput
): Promise<PredictGenderOutput> {
  return predictGenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictGenderPrompt',
  input: {schema: PredictGenderInputSchema},
  output: {schema: PredictGenderOutputSchema},
  prompt: `You are an expert in analyzing images to determine the perceived gender of a person. Look at the image and determine if the person is male or female. If you are uncertain, respond with "Uncertain".

Image: {{media url=photoDataUri}}`,
});

const predictGenderFlow = ai.defineFlow(
  {
    name: 'predictGenderFlow',
    inputSchema: PredictGenderInputSchema,
    outputSchema: PredictGenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
