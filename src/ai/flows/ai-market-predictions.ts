'use server';
/**
 * @fileOverview An AI agent that provides market trend and price predictions for crypto assets.
 *
 * - aiMarketPredictions - A function that handles the AI market predictions process.
 * - AIMarketPredictionsInput - The input type for the aiMarketPredictions function.
 * - AIMarketPredictionsOutput - The return type for the aiMarketPredictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIMarketPredictionsInputSchema = z.object({
  asset: z.string().describe('The cryptocurrency or financial asset for which to generate a prediction (e.g., "BTC", "ETH", "EUR/USD").'),
});
export type AIMarketPredictionsInput = z.infer<typeof AIMarketPredictionsInputSchema>;

const AIMarketPredictionsOutputSchema = z.object({
  asset: z.string().describe('The asset for which the prediction is made.'),
  trend: z.string().describe('The predicted market trend for the asset (e.g., "Bullish", "Bearish", "Sideways").'),
  confidence: z.number().min(0).max(100).describe('The confidence level of the prediction, as a percentage from 0 to 100.'),
  targetPrice: z.number().describe('The predicted target price for the asset.'),
  timestamp: z.string().datetime().describe('The UTC timestamp when the prediction was generated.'),
});
export type AIMarketPredictionsOutput = z.infer<typeof AIMarketPredictionsOutputSchema>;

export async function aiMarketPredictions(input: AIMarketPredictionsInput): Promise<AIMarketPredictionsOutput> {
  return aiMarketPredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMarketPredictionsPrompt',
  input: {schema: AIMarketPredictionsInputSchema},
  output: {schema: AIMarketPredictionsOutputSchema},
  prompt: `You are an expert financial analyst specializing in cryptocurrency and forex market predictions.
Your task is to provide a market trend and a target price prediction for the given asset.

Provide your analysis in a structured JSON format, adhering strictly to the output schema. Ensure the timestamp is current UTC.

Asset to analyze: {{{asset}}}`,
});

const aiMarketPredictionsFlow = ai.defineFlow(
  {
    name: 'aiMarketPredictionsFlow',
    inputSchema: AIMarketPredictionsInputSchema,
    outputSchema: AIMarketPredictionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Add current timestamp to the output
    return {...output!, timestamp: new Date().toISOString()};
  }
);
