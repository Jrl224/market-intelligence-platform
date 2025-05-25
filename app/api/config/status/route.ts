import { NextResponse } from 'next/server'

// Check which APIs are configured (without exposing the actual keys)
export async function GET() {
  const apiStatus = {
    // Search & Trends
    SERPAPI_KEY: !!process.env.SERPAPI_KEY,
    
    // News
    NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
    BING_NEWS_KEY: !!process.env.BING_NEWS_KEY,
    
    // Social Media
    REDDIT_CLIENT_ID: !!process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: !!process.env.REDDIT_CLIENT_SECRET,
    YOUTUBE_API_KEY: !!process.env.YOUTUBE_API_KEY,
    TWITTER_BEARER_TOKEN: !!process.env.TWITTER_BEARER_TOKEN,
    INSTAGRAM_BASIC_DISPLAY_TOKEN: !!process.env.INSTAGRAM_BASIC_DISPLAY_TOKEN,
    TIKTOK_API_KEY: !!process.env.TIKTOK_API_KEY,
    
    // Professional Networks
    LINKEDIN_ACCESS_TOKEN: !!process.env.LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_CLIENT_ID: !!process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: !!process.env.LINKEDIN_CLIENT_SECRET,
    
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
    
    // Database
    DATABASE_URL: !!process.env.DATABASE_URL,
    REDIS_URL: !!process.env.REDIS_URL,
    
    // Other
    HUGGINGFACE_TOKEN: !!process.env.HUGGINGFACE_TOKEN,
    FIRECRAWL_API_KEY: !!process.env.FIRECRAWL_API_KEY
  }
  
  // Calculate statistics
  const totalApis = Object.keys(apiStatus).length
  const configuredApis = Object.values(apiStatus).filter(Boolean).length
  const requiredApis = ['SERPAPI_KEY', 'NEWSAPI_KEY', 'OPENAI_API_KEY']
  const hasRequiredApis = requiredApis.every(key => apiStatus[key as keyof typeof apiStatus])
  const hasAiProvider = apiStatus.OPENAI_API_KEY || apiStatus.ANTHROPIC_API_KEY || apiStatus.GEMINI_API_KEY
  
  // Feature availability based on API keys
  const features = {
    trends: apiStatus.SERPAPI_KEY,
    news: apiStatus.NEWSAPI_KEY || apiStatus.BING_NEWS_KEY,
    twitter: apiStatus.TWITTER_BEARER_TOKEN,
    linkedin: apiStatus.LINKEDIN_ACCESS_TOKEN,
    reddit: apiStatus.REDDIT_CLIENT_ID && apiStatus.REDDIT_CLIENT_SECRET,
    youtube: apiStatus.YOUTUBE_API_KEY,
    instagram: apiStatus.INSTAGRAM_BASIC_DISPLAY_TOKEN,
    tiktok: apiStatus.TIKTOK_API_KEY,
    competitors: hasAiProvider && (apiStatus.SERPAPI_KEY || apiStatus.NEWSAPI_KEY),
    research: apiStatus.SEMANTIC_SCHOLAR_KEY || apiStatus.CORE_API_KEY,
    patents: apiStatus.SERPAPI_KEY,
    economic: apiStatus.FRED_API_KEY,
    financial: apiStatus.ALPHA_VANTAGE_KEY || apiStatus.RAPIDAPI_KEY,
    insights: hasAiProvider,
    export: true, // Always available
    historicalData: apiStatus.DATABASE_URL,
    caching: apiStatus.REDIS_URL
  }
  
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
      hasMinimumRequired: hasRequiredApis,
      missingRequired: requiredApis.filter(key => !apiStatus[key as keyof typeof apiStatus])
    },
    features,
    categories: {
      search: apiStatus.SERPAPI_KEY,
      news: apiStatus.NEWSAPI_KEY || apiStatus.BING_NEWS_KEY,
      social: {
        reddit: apiStatus.REDDIT_CLIENT_ID && apiStatus.REDDIT_CLIENT_SECRET,
        youtube: apiStatus.YOUTUBE_API_KEY,
        twitter: apiStatus.TWITTER_BEARER_TOKEN,
        instagram: apiStatus.INSTAGRAM_BASIC_DISPLAY_TOKEN,
        tiktok: apiStatus.TIKTOK_API_KEY
      },
      professional: {
        linkedin: apiStatus.LINKEDIN_ACCESS_TOKEN
      },
      research: apiStatus.SEMANTIC_SCHOLAR_KEY || apiStatus.CORE_API_KEY || apiStatus.CROSSREF_EMAIL,
      economic: apiStatus.FRED_API_KEY || apiStatus.CENSUS_API_KEY,
      financial: apiStatus.ALPHA_VANTAGE_KEY || apiStatus.RAPIDAPI_KEY,
      ai: hasAiProvider
    },
    timestamp: new Date().toISOString()
  }, { headers })
}