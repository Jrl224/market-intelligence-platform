# Deployment Guide for Market Intelligence Platform

## Quick Deployment Steps

### 1. Environment Variables Required in Vercel

Go to your Vercel project settings → Environment Variables and add:

#### Required (Minimum for Basic Functionality)
```
SERPAPI_KEY=your_serpapi_key
NEWSAPI_KEY=your_newsapi_key
GEMINI_API_KEY=your_gemini_key  # Or any one AI provider
```

#### Recommended for Better Results
```
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
YOUTUBE_API_KEY=your_youtube_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
FRED_API_KEY=your_fred_key
SEMANTIC_SCHOLAR_KEY=your_semantic_scholar_key
CROSSREF_EMAIL=jrl224@rutgers.edu
```

#### Optional Enhanced Features
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
CORE_API_KEY=your_core_key
BING_NEWS_KEY=your_bing_key
CENSUS_API_KEY=your_census_key
RAPIDAPI_KEY=your_rapidapi_key
HUGGINGFACE_TOKEN=your_huggingface_token
FIRECRAWL_API_KEY=your_firecrawl_key
```

### 2. Deployment Process

1. **In Vercel Dashboard**:
   - Click on your project
   - Go to "Settings" → "Environment Variables"
   - Add each API key from above
   - Click "Save"

2. **Trigger New Deployment**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Select "Redeploy with existing Build Cache" (faster)
   - Wait ~30 seconds for deployment

3. **Verify Deployment**:
   - Visit your deployment URL
   - Try a search like "Tesla stock analysis"
   - Check the settings icon to see API status

### 3. Custom Domain Setup

1. Go to Settings → Domains
2. Add `imagine-tools.com`
3. Follow DNS configuration:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`

### 4. Testing Your Deployment

Test these searches to verify functionality:
- "Apple AAPL stock" - Tests financial APIs
- "AI healthcare trends" - Tests trend analysis
- "renewable energy market" - Tests comprehensive analysis
- "Tesla news" - Tests news aggregation

### 5. Monitoring

- Check Vercel Analytics for usage
- Monitor Function logs for API errors
- Use the API Status button (settings icon) in search bar

### 6. Troubleshooting

**Build Fails**:
- Check build logs for specific errors
- Ensure all TypeScript errors are fixed
- Verify package.json dependencies

**No Data Showing**:
- Verify API keys are correctly added
- Check API quotas/limits
- Use browser console for errors

**Slow Performance**:
- Some APIs have rate limits
- First load may be slower (cold start)
- Consider upgrading Vercel plan for better performance

### 7. API Key Resources

1. **SerpAPI** ($50/mo): https://serpapi.com
2. **NewsAPI** (FREE): https://newsapi.org/register  
3. **Gemini** (FREE): https://makersuite.google.com/app/apikey
4. **Reddit** (FREE): https://www.reddit.com/prefs/apps
5. **Alpha Vantage** (FREE): https://www.alphavantage.co/support/#api-key

---

## Latest Deployment Info

- **Latest Commit**: 5283a61
- **Branch**: main
- **Status**: Ready to deploy
- **All TypeScript errors**: Fixed ✅

## Support

For issues:
1. Check Vercel Function logs
2. Use browser DevTools console
3. Check GitHub issues
4. Verify API quotas
