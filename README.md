# Market Intelligence Platform

🚀 **AI-powered market intelligence platform that analyzes any topic, product, or industry in real-time**

## Features

### 🔍 Comprehensive Data Sources
- **Google Trends**: Real-time search interest and geographic distribution via SerpAPI
- **News Aggregation**: Latest news from NewsAPI, Google News, and Bing News
- **Academic Research**: Papers from Semantic Scholar, arXiv, PubMed, CORE, and Crossref
- **Social Sentiment**: Reddit discussions and YouTube comment analysis
- **Patent Data**: USPTO and Google Patents integration
- **Economic Indicators**: FRED, World Bank, and Alpha Vantage data
- **Financial Markets**: Stock data, sector performance, and market indices
- **AI Insights**: Market analysis using OpenAI, Anthropic Claude, and Google Gemini

### 📊 Key Features
- Single search bar interface (Google-like simplicity)
- Real-time data fetching from 15+ APIs
- Dynamic report generation with relevant sections
- Professional PDF export with charts and formatting
- Responsive design with Tailwind CSS
- No database required - completely stateless

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Jrl224/market-intelligence-platform.git
cd market-intelligence-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your API keys:

```env
# Search & Trends
SERPAPI_KEY=your_serpapi_key  # Required for Google Trends

# News
NEWSAPI_KEY=your_newsapi_key
BING_NEWS_KEY=your_bing_key  # Optional

# Social Media
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
YOUTUBE_API_KEY=your_youtube_key

# Academic Research
SEMANTIC_SCHOLAR_KEY=your_semantic_scholar_key
CORE_API_KEY=your_core_key  # Optional
CROSSREF_EMAIL=your_email  # For Crossref API

# Economic Data
FRED_API_KEY=your_fred_key  # Federal Reserve Economic Data
CENSUS_API_KEY=your_census_key  # Optional

# Financial Data
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
RAPIDAPI_KEY=your_rapidapi_key  # Optional for Yahoo Finance

# AI Providers (at least one required for insights)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# Other
HUGGINGFACE_TOKEN=your_huggingface_token  # Optional
FIRECRAWL_API_KEY=your_firecrawl_key  # Optional
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production
```bash
npm run build
npm start
```

## API Key Resources

### Required APIs (Minimum Setup)
1. **SerpAPI** ($50/month): [serpapi.com](https://serpapi.com) - For Google Trends
2. **NewsAPI** (Free tier): [newsapi.org](https://newsapi.org) - For news articles
3. **Reddit** (Free): [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) - Create an app
4. **OpenAI** (Pay-per-use): [platform.openai.com](https://platform.openai.com) - For AI insights

### Optional APIs (Enhanced Features)
- **Semantic Scholar** (Free): [semanticscholar.org/product/api](https://www.semanticscholar.org/product/api)
- **YouTube Data API** (Free quota): [console.cloud.google.com](https://console.cloud.google.com)
- **FRED API** (Free): [fred.stlouisfed.org/docs/api](https://fred.stlouisfed.org/docs/api)
- **Alpha Vantage** (Free tier): [alphavantage.co](https://www.alphavantage.co)
- **Anthropic Claude**: [anthropic.com](https://www.anthropic.com)
- **Google Gemini**: [makersuite.google.com](https://makersuite.google.com)

## How It Works

1. **Search**: Enter any topic, company, product, or industry
2. **Data Collection**: The platform queries multiple APIs in parallel
3. **AI Analysis**: Multiple AI models analyze the data and generate insights
4. **Report Generation**: Dynamic sections based on available data
5. **Export**: Download professional PDF reports

## Example Searches

- "sustainable packaging trends"
- "Tesla Model 3 market analysis"
- "AI in healthcare 2024"
- "cryptocurrency regulation"
- "Apple AAPL stock analysis"
- "renewable energy market"

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel
Go to Settings → Environment Variables and add all keys from `.env.local`

## Architecture

```
├── app/
│   ├── api/              # API routes for each data source
│   │   ├── trends/       # Google Trends data
│   │   ├── news/         # News aggregation
│   │   ├── sentiment/    # Reddit & YouTube analysis
│   │   ├── research/     # Academic papers
│   │   ├── patents/      # Patent search
│   │   ├── economic/     # Economic indicators
│   │   ├── financial/    # Stock market data
│   │   └── ai/           # AI insights & summary
│   └── page.tsx          # Main search interface
├── components/
│   ├── sections/         # Report section components
│   └── ...               # UI components
├── lib/
│   ├── api/clients/      # API client implementations
│   └── ...               # Utilities
└── types/                # TypeScript definitions
```

## Features in Detail

### Market Trends Analysis
- Search interest over time (90-day timeline)
- Related search queries and rising topics
- Geographic distribution of interest
- Real-time data from Google Trends

### News & Media Coverage
- Latest articles from multiple sources
- Sentiment analysis of coverage
- Source diversity tracking
- 30-day news history

### Community Sentiment
- Reddit discussion analysis across multiple subreddits
- YouTube comment sentiment scoring
- Engagement metrics and trending topics
- Real-time community pulse

### Academic Research
- Papers from top academic databases
- Citation counts and impact metrics
- Author information and abstracts
- DOI links for full access

### Patent Landscape
- US and international patent search
- Inventor and assignee information
- Patent abstracts and classifications
- Filing trends over time

### Economic Context
- GDP, inflation, unemployment data
- Federal Reserve indicators
- Global economic metrics
- Industry-specific indicators

### Financial Analysis
- Real-time stock quotes
- Market indices performance
- Sector analysis
- 52-week highs/lows

### AI-Powered Insights
- Market opportunities identification
- Risk assessment and mitigation strategies
- Actionable recommendations
- Future outlook and projections
- Competitive landscape analysis

## Troubleshooting

### No Data Showing?
1. Check if API keys are correctly set in `.env.local`
2. Verify API quotas haven't been exceeded
3. Check browser console for errors
4. Some APIs have rate limits - wait a few minutes

### PDF Export Issues?
- Ensure all chart libraries are loaded
- Check for console errors during generation
- Try with a smaller report first

### API Errors?
- Most APIs have free tiers with limits
- The platform gracefully handles missing APIs
- Each section works independently

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues first
- Provide API error messages if applicable

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
