# Free API Setup Guide - No Credit Card Required

## APIs You Can Actually Get for Free

### 1. **NewsAPI** (Free tier: 100 requests/day)
- Go to: https://newsapi.org/register
- Sign up with email
- Get API key instantly
- Add to Vercel: `NEWSAPI_KEY=your_key`

### 2. **Reddit** (Completely free)
- Go to: https://www.reddit.com/prefs/apps
- Click "Create App" 
- Choose "script" type
- Use http://localhost:3000 as redirect URI
- Get both Client ID and Secret
- Add to Vercel:
  - `REDDIT_CLIENT_ID=your_id`
  - `REDDIT_CLIENT_SECRET=your_secret`

### 3. **YouTube Data API** (Free quota: 10,000 units/day)
- Go to: https://console.cloud.google.com
- Create new project (or use existing)
- Enable "YouTube Data API v3"
- Create credentials → API Key
- Add to Vercel: `YOUTUBE_API_KEY=your_key`

### 4. **Alpha Vantage** (Free: 25 requests/day)
- Go to: https://www.alphavantage.co/support/#api-key
- Enter email
- Get key instantly
- Add to Vercel: `ALPHA_VANTAGE_KEY=your_key`

### 5. **FRED (Federal Reserve)** (Free: 120 requests/minute)
- Go to: https://fred.stlouisfed.org/docs/api/api_key.html
- Create account
- Request API key
- Add to Vercel: `FRED_API_KEY=your_key`

### 6. **Semantic Scholar** (Free: 100 requests/5 min)
- Go to: https://www.semanticscholar.org/product/api
- Sign up
- Get API key
- Add to Vercel: `SEMANTIC_SCHOLAR_KEY=your_key`

### 7. **SerpAPI** (Free trial: 100 searches)
- Go to: https://serpapi.com
- Sign up for free trial
- No credit card required initially
- Add to Vercel: `SERPAPI_KEY=your_key`

### 8. **OpenAI** (Needed for query expansion)
- You need at least $5 credit
- Go to: https://platform.openai.com
- Add to Vercel: `OPENAI_API_KEY=your_key`

## What This Gives You

With these FREE APIs, you get:
- ✅ Real news articles (NewsAPI)
- ✅ Reddit discussions & sentiment (Reddit)
- ✅ YouTube comment analysis (YouTube)
- ✅ Stock market data (Alpha Vantage)
- ✅ Economic indicators (FRED)
- ✅ Academic research (Semantic Scholar)
- ✅ Google Trends (SerpAPI trial)
- ✅ Smart query expansion (OpenAI)

## What You're Missing (But Don't Need)

- ❌ Twitter/X - Now costs $100/month minimum
- ❌ LinkedIn - Requires partnership approval
- ❌ Instagram - API deprecated
- ❌ TikTok - Requires business verification

## Quick Setup in Vercel

1. Add these to your Vercel Environment Variables:
```
NEWSAPI_KEY=get_from_newsapi_org
REDDIT_CLIENT_ID=get_from_reddit
REDDIT_CLIENT_SECRET=get_from_reddit
YOUTUBE_API_KEY=get_from_google_console
ALPHA_VANTAGE_KEY=get_from_alphavantage
FRED_API_KEY=get_from_fred
SEMANTIC_SCHOLAR_KEY=get_from_semanticscholar
SERPAPI_KEY=get_from_serpapi_trial
OPENAI_API_KEY=your_openai_key
CROSSREF_EMAIL=your_email@example.com
```

2. Redeploy your app

3. The Twitter and LinkedIn sections will show "No API key configured" which is fine

## Total Cost: $0-5
- All APIs except OpenAI: $0
- OpenAI minimum: $5 (lasts ~1000 queries)

## Test Your Setup

After adding keys and redeploying, test with:
- "Tesla stock analysis" - Should show real stock data
- "AI trends 2025" - Should show real trends
- "renewable energy Reddit" - Should show real Reddit posts
