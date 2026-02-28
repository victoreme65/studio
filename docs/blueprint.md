# **App Name**: Solar AI

## Core Features:

- Secure User Authentication & Profile Management: Users can securely register and log in via Firebase Authentication. A dashboard displays personal user data including balance, mining rate, and VIP status, stored and managed in Firestore.
- Simplified Token Mining Simulation: Users can initiate a 'Start Mining' process for SOLAR tokens. The system calculates earned tokens based on a simplified time-based model since the last claim, updating the user's balance in Firestore. Includes basic mining animation feedback.
- AI-Powered Trading Signals Display: View AI-generated crypto and forex trading signals, including BUY/SELL, entry, take profit, stop loss, and confidence levels. OpenAI API is used as a tool to generate these signals, which are then stored in Firestore for display.
- AI-Driven Price Predictions: Access AI-powered trend and target price predictions for major crypto and forex assets. The OpenAI API is utilized as a tool to formulate these predictions, which are then saved in Firestore and presented on a dedicated page.
- Interactive AI Trading Assistant: A chat-based interface allowing users to ask trading-related questions (e.g., 'Should I buy BTC?'). The OpenAI API processes these queries as a tool to provide insightful trading analysis.
- Basic Token Staking Mechanism: Users can stake their SOLAR tokens for predefined periods (7, 14, 30 days) to earn rewards. The system manages the locking of tokens and updates staking balances and statuses within Firestore.
- Referral System with Rewards: Each user receives a unique referral code. When new users register using a referral code, the referrer is tracked in Firestore and automatically receives a percentage of the referred user's simulated mining earnings.

## Style Guidelines:

- Primary background color: Black (#0A0A0A) for a deep, modern, and high-contrast base, emphasizing the futuristic theme.
- Primary accent color: Vibrant Blue (#0066FF) to highlight interactive elements, branding, and active states, evoking a tech-driven and clean aesthetic.
- Secondary accent color: Gold Yellow (#FFD700) used for key information, warnings, and special offers, providing a strong contrast and visual interest.
- Main text color: White (#FFFFFF) for maximum readability against the dark background.
- Secondary text color: Light Gray (#AAAAAA) for supportive text, helping to differentiate content without causing visual clutter.
- Headlines will use 'Space Grotesk', a sans-serif font, for a modern, techy, and scientific feel that aligns with the AI and crypto theme. Body text will utilize 'Inter', a clean grotesque-style sans-serif, ensuring readability for data and descriptions.
- Utilize minimalist, sleek, and sharp icons with a futuristic, crypto-style aesthetic, complemented by effects that evoke glassmorphism for a polished look.
- Implement a responsive and clean layout structured with glassmorphism-style cards, ensuring optimal user experience across mobile, tablet, and desktop devices. Emphasis on logical grouping of information and ample whitespace.
- Integrate subtle yet smooth animations for transitions, loading states, and interactive elements, providing a dynamic and premium feel to the user interface.