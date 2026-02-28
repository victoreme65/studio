'use server';
/**
 * @fileOverview An AI trading assistant that provides analysis based on user questions.
 *
 * - interactiveAiTradingAssistant - A function that handles user questions and provides trading analysis.
 * - InteractiveAiTradingAssistantInput - The input type for the interactiveAiTradingAssistant function.
 * - InteractiveAiTradingAssistantOutput - The return type for the interactiveAiTradingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveAiTradingAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question about trading.'),
});
export type InteractiveAiTradingAssistantInput = z.infer<typeof InteractiveAiTradingAssistantInputSchema>;

const InteractiveAiTradingAssistantOutputSchema = z.object({
  analysis: z.string().describe('The AI\'s trading analysis or answer.'),
});
export type InteractiveAiTradingAssistantOutput = z.infer<typeof InteractiveAiTradingAssistantOutputSchema>;

export async function interactiveAiTradingAssistant(input: InteractiveAiTradingAssistantInput): Promise<InteractiveAiTradingAssistantOutput> {
  return interactiveAiTradingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveAiTradingAssistantPrompt',
  input: {schema: InteractiveAiTradingAssistantInputSchema},
  output: {schema: InteractiveAiTradingAssistantOutputSchema},
  prompt: `You are an expert AI trading assistant for cryptocurrencies and forex markets. Your goal is to provide intelligent trading analysis and insights based on the user's questions.

Analyze the following question and provide a comprehensive trading analysis, including potential risks, opportunities, and relevant market factors. If the question is about a specific asset, try to provide a concise recommendation.

Question: {{{question}}}`,
});

const interactiveAiTradingAssistantFlow = ai.defineFlow(
  {
    name: 'interactiveAiTradingAssistantFlow',
    inputSchema: InteractiveAiTradingAssistantInputSchema,
    outputSchema: InteractiveAiTradingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
