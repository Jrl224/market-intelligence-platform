# Deployment Troubleshooting Guide

## Common Deployment Issues and Fixes

### 1. Build Errors

#### Missing Dependencies
If you see errors about missing packages:
```bash
npm install
npm run build
```

#### TypeScript Errors
The project uses TypeScript strict mode. Common fixes:
- Ensure all imports have proper types
- Check that QueryExpansion type is exported from the route file

### 2. Environment Variables

#### Required for Basic Functionality:
- `SERPAPI_KEY` - For Google Trends
- `NEWSAPI_KEY` - For news articles  
- `OPENAI_API_KEY` - For AI insights and query expansion

#### How to Add in Vercel:
1. Go to Project Settings → Environment Variables
2. Add each key with its value
3. Ensure they're available for Production

### 3. Runtime Errors

#### API Route Errors
If API routes fail:
- Check that all API routes return proper NextResponse
- Ensure error handling doesn't expose sensitive data
- Verify CORS headers are set correctly

#### Query Expansion Specific Issues
If query expansion fails:
- It will fallback to pattern matching (no API needed)
- Check browser console for specific errors
- Verify OpenAI API key is set correctly

### 4. Performance Issues

#### Large Response Sizes
- The platform fetches data from multiple APIs in parallel
- Consider implementing pagination for large datasets
- Use the built-in mock data for testing

### 5. Vercel-Specific Configuration

The `vercel.json` file should contain:
```json
{
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 30
    }
  }
}
```

This extends the timeout for API routes that make multiple external calls.

## Testing After Deployment

1. **Basic Test**: 
   - Visit: `https://your-domain.vercel.app`
   - Search for "OxiClean"
   - Verify query expansion appears at top

2. **API Status Check**:
   - Click the API Status button
   - Verify which APIs are configured
   - Note any missing critical APIs

3. **Feature Testing**:
   - Query Expansion: Search for any CPG brand
   - Competitor Analysis: Should show for brand queries
   - Sentiment Analysis: Should always sum to 100%
   - Financial Data: Should display properly in PDF

## Quick Fixes

### If Query Expansion Doesn't Show:
1. Check browser console for errors
2. Verify `/api/ai/query-expansion` returns data
3. Ensure OpenAI API key is set (or rely on fallback)

### If Build Fails:
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Fix any TypeScript errors

### If APIs Return 500 Errors:
1. Check environment variables are set
2. Verify API keys are valid
3. Check rate limits haven't been exceeded

## Support

For additional help:
- Check Vercel deployment logs
- Review browser console for client-side errors
- Verify all environment variables are set correctly
