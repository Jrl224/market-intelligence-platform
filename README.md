# Market Intelligence Platform

AI-powered market intelligence platform that analyzes any topic, product, or industry in real-time.

## Features

- **Universal Analysis**: Works for any topic, product, company, or trend
- **Real-Time Processing**: All data fetched and analyzed on-demand
- **AI Synthesis**: Multiple AI models create cohesive insights
- **Zero Data Storage**: Privacy-first, no user data saved
- **Smart Relevance**: Only shows applicable sections based on query
- **Visual Intelligence**: Auto-generated charts and visualizations
- **Export Capability**: Client-side PDF generation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **PDF Generation**: jsPDF with html2canvas
- **Deployment**: Vercel

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your API keys
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required API keys. The platform integrates with:
- SerpAPI for search trends
- NewsAPI for current news
- Reddit API for community discussions
- US Census & FRED for economic data
- Crossref & Semantic Scholar for research papers
- YouTube Data API for video trends
- Alpha Vantage for financial data
- OpenAI/Gemini for AI insights
- Firecrawl for web content analysis

## Deployment

The platform is configured for automatic deployment to Vercel. Simply push to your GitHub repository and Vercel will handle the rest.

## Project Structure

```
market-intelligence-platform/
├── app/
│   ├── api/          # API routes for data fetching
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
│   └── sections/     # Report section components
├── lib/             # Utility functions
├── types/           # TypeScript definitions
└── public/          # Static assets
```

## License

MIT