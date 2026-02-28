'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered crypto trading signals using live price data.
 */

import { ai, getLiveCryptoPrice } from '@/ai/genkit';
import { z } from 'genkit';

const TradingSignalsInputSchema = z.object({
  pairs: z.array(z.string()).describe('An array of crypto pairs, e.g., ["bitcoin", "ethereum"].'),
});
export type TradingSignalsInput = z.infer<typeof TradingSignalsInputSchema>;

const SignalSchema = z.object({
  pair: z.string().describe('The trading pair (e.g., BTC/USDT).'),
  type: z.enum(['BUY', 'SELL']).describe('The recommended action.'),
  entry: z.number().describe('Entry price.'),
  takeProfit: z.number().describe('Target price.'),
  stopLoss: z.number().describe('Risk exit price.'),
  confidence: z.number().min(0).max(100).describe('Confidence percentage.'),
  timestamp: z.string().datetime().describe('Generation timestamp.'),
});

const TradingSignalsOutputSchema = z.object({
  signals: z.array(SignalSchema),
});
export type TradingSignalsOutput = z.infer<typeof TradingSignalsOutputSchema>;

export async function getTradingSignals(input: TradingSignalsInput): Promise<TradingSignalsOutput> {
  return aiTradingSignalsFlow(input);
}

const aiTradingSignalsPrompt = ai.definePrompt({
  name: 'aiTradingSignalsPrompt',
  input: { schema: TradingSignalsInputSchema },
  output: { schema: TradingSignalsOutputSchema },
  tools: [getLiveCryptoPrice],
  prompt: `You are an expert crypto analyst. Use the getLiveCryptoPrice tool to find the current market price for each requested asset.
  
Based on the live prices, generate a high-probability trading signal for each.
Ensure takeProfit and stopLoss are realistic relative to the current entry price.

Assets:
{{#each pairs}}
- {{this}}
{{/each}}`,
});

const aiTradingSignalsFlow = ai.defineFlow(
  {
    name: 'aiTradingSignalsFlow',
    inputSchema: TradingSignalsInputSchema,
    outputSchema: TradingSignalsOutputSchema,
  },
  async (input) => {
    const { output } = await aiTradingSignalsPrompt(input);
    if (!output) throw new Error('Failed to generate signals.');
    return output;
  }
);
