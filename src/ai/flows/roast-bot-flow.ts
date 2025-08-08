'use server';

/**
 * @fileOverview A bot that roasts the user.
 *
 * - roastUser - A function that generates a roast.
 * - RoastUserInput - The input type for the roastUser function.
 * - RoastUserOutput - The return type for the roastUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoastUserInputSchema = z.object({
  topic: z.string().describe('The topic to be roasted.'),
});
export type RoastUserInput = z.infer<typeof RoastUserInputSchema>;

const RoastUserOutputSchema = z.object({
  roast: z.string().describe('The generated roast.'),
});
export type RoastUserOutput = z.infer<typeof RoastUserOutputSchema>;

export async function roastUser(input: RoastUserInput): Promise<RoastUserOutput> {
  return roastUserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roastUserPrompt',
  input: {schema: RoastUserInputSchema},
  output: {schema: RoastUserOutputSchema},
  prompt: `You are a merciless roast bot. Your purpose is to roast the user about the provided topic. Be witty, cruel, and relentlessly funny. Do not hold back. Make them question their life choices.

Topic: {{{topic}}}`,
});

const roastUserFlow = ai.defineFlow(
  {
    name: 'roastUserFlow',
    inputSchema: RoastUserInputSchema,
    outputSchema: RoastUserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
