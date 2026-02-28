'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered crypto and forex trading signals.
 *
 * - getTradingSignals - A function that fetches AI-generated trading signals for specified pairs.
 * - TradingSignalsInput - The input type for the getTradingSignals function.
 * - TradingSignalsOutput - The return type for the getTradingSignals function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TradingSignalsInputSchema = z.object({
  pairs: z.array(z.string()).describe('An array of crypto and forex pairs for which to generate trading signals, e.g., ["BTC/USDT", "EUR/USD"].'),
});
export type TradingSignalsInput = z.infer<typeof TradingSignalsInputSchema>;

const SignalSchema = z.object({
  pair: z.string().describe('The trading pair (e.g., BTC/USDT, EUR/USD).'),
  type: z.enum(['BUY', 'SELL']).describe('The recommended trading action: BUY or SELL.'),
  entry: z.number().describe('The recommended entry price for the trade.'),
  takeProfit: z.number().describe('The recommended take profit price for the trade.'),
  stopLoss: z.number().describe('The recommended stop loss price for the trade.'),
  confidence: z.number().min(0).max(100).describe('The confidence level of the signal, as a percentage (0-100).'),
  timestamp: z.string().datetime().describe('The UTC timestamp when the signal was generated in ISO 8601 format.'),
});

const TradingSignalsOutputSchema = z.object({
  signals: z.array(SignalSchema).describe('An array of AI-generated trading signals.'),
});
export type TradingSignalsOutput = z.infer<typeof TradingSignalsOutputSchema>;

export async function getTradingSignals(input: TradingSignalsInput): Promise<TradingSignalsOutput> {
  return aiTradingSignalsFlow(input);
}

const aiTradingSignalsPrompt = ai.definePrompt({
  name: 'aiTradingSignalsPrompt',
  input: { schema: TradingSignalsInputSchema },
  output: { schema: TradingSignalsOutputSchema },
  prompt: `You are an expert crypto and forex trading analyst. Your task is to generate precise trading signals for the requested pairs.\nFor each requested pair, provide a trading signal that includes the pair name, whether to BUY or SELL, an entry price, a take profit price, a stop loss price, and a confidence level (0-100%). Also include a UTC timestamp for when the signal was generated.\nThe output MUST be a JSON object conforming to the provided schema.\n\nPairs to generate signals for:\n{{#each pairs}}\n- {{this}}\n{{/each}}`,
});

const aiTradingSignalsFlow = ai.defineFlow(
  {
    name: 'aiTradingSignalsFlow',
    inputSchema: TradingSignalsInputSchema,
    outputSchema: TradingSignalsOutputSchema,
  },
  async (input) => {
    const { output } = await aiTradingSignalsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate trading signals.');
    }
    return output;
  }
);
