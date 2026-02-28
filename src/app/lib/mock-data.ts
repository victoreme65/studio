export const MOCK_SIGNALS = [
  {
    pair: "BTC/USDT",
    type: "BUY" as const,
    entry: 64250.50,
    takeProfit: 68000.00,
    stopLoss: 62000.00,
    confidence: 88,
    timestamp: new Date().toISOString()
  },
  {
    pair: "ETH/USDT",
    type: "SELL" as const,
    entry: 3450.20,
    takeProfit: 3100.00,
    stopLoss: 3600.00,
    confidence: 72,
    timestamp: new Date().toISOString()
  },
  {
    pair: "SOL/USDT",
    type: "BUY" as const,
    entry: 145.80,
    takeProfit: 165.00,
    stopLoss: 138.00,
    confidence: 91,
    timestamp: new Date().toISOString()
  }
];

export const MOCK_PREDICTIONS = [
  {
    asset: "BTC",
    trend: "Bullish",
    confidence: 85,
    targetPrice: 72000,
    timestamp: new Date().toISOString()
  },
  {
    asset: "EUR/USD",
    trend: "Bearish",
    confidence: 65,
    targetPrice: 1.075,
    timestamp: new Date().toISOString()
  },
  {
    asset: "ETH",
    trend: "Sideways",
    confidence: 50,
    targetPrice: 3500,
    timestamp: new Date().toISOString()
  }
];

export const MOCK_LEADERBOARD = [
  { username: "SolarKing", balance: 125000.45, vip: true },
  { username: "CryptoWhale", balance: 98000.12, vip: true },
  { username: "MinerMax", balance: 85400.00, vip: false },
  { username: "AI_Trader_01", balance: 72100.33, vip: true },
  { username: "BullRunner", balance: 65000.89, vip: false },
];