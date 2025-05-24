import { NextResponse } from 'next/server'

// Check which APIs are configured (without exposing the actual keys)
export async function GET() {
  const apiStatus = {
    // Search & Trends
    SERPAPI_KEY: !!process.env.SERPAPI_KEY,
    
    // News
    NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
    BING_NEWS_KEY: !!process.env.BING_NEWS_KEY,
    
    // Social
    REDDIT_CLIENT_ID: !!process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: !!process.env.REDDIT_CLIENT_SECRET,
    YOUTUBE_API_KEY: !!process.env.YOUTUBE_API_KEY,
    
    // Research
    SEMANTIC_SCHOLAR_KEY: !!process.env.SEMANTIC_SCHOLAR_KEY,
    CORE_API_KEY: !!process.env.CORE_API_KEY,
    CROSSREF_EMAIL: !!process.env.CROSSREF_EMAIL,
    
    // Economic
    FRED_API_KEY: !!process.env.FRED_API_KEY,
    CENSUS_API_KEY: !!process.env.CENSUS_API_KEY,
    
    // Financial
    ALPHA_VANTAGE_KEY: !!process.env.ALPHA_VANTAGE_KEY,
    RAPIDAPI_KEY: !!process.env.RAPIDAPI_KEY,
    
    // AI
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    
    // Other
    HUGGINGFACE_TOKEN: !!process.env.HUGGINGFACE_TOKEN,
    FIRECRAWL_API_KEY: !!process.env.FIRECRAWL_API_KEY
  }
  
  // Calculate statistics
  const totalApis = Object.keys(apiStatus).length
  const configuredApis = Object.values(apiStatus).filter(Boolean).length
  const requiredApis = ['SERPAPI_KEY', 'NEWSAPI_KEY']
  const hasRequiredApis = requiredApis.every(key => apiStatus[key as keyof typeof apiStatus])
  const hasAiProvider = apiStatus.OPENAI_API_KEY || apiStatus.ANTHROPIC_API_KEY || apiStatus.GEMINI_API_KEY
  
  // Add CORS headers for browser access
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  }
  
  return NextResponse.json({
    status: apiStatus,
    stats: {
      total: totalApis,
      configured: configuredApis,
      percentage: Math.round((configuredApis / totalApis) * 100),
      hasMinimumRequired: hasRequiredApis && hasAiProvider,
      missingRequired: requiredApis.filter(key => !apiStatus[key as keyof typeof apiStatus])
    },
    categories: {
      search: apiStatus.SERPAPI_KEY,
      news: apiStatus.NEWSAPI_KEY || apiStatus.BING_NEWS_KEY,
      social: (apiStatus.REDDIT_CLIENT_ID && apiStatus.REDDIT_CLIENT_SECRET) || apiStatus.YOUTUBE_API_KEY,
      research: apiStatus.SEMANTIC_SCHOLAR_KEY || apiStatus.CORE_API_KEY || apiStatus.CROSSREF_EMAIL,
      economic: apiStatus.FRED_API_KEY || apiStatus.CENSUS_API_KEY,
      financial: apiStatus.ALPHA_VANTAGE_KEY || apiStatus.RAPIDAPI_KEY,
      ai: hasAiProvider
    },
    timestamp: new Date().toISOString()
  }, { headers })
}
