import { NextResponse } from 'next/server'

export async function GET() {
  const deploymentInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    features: {
      queryExpansion: {
        enabled: !!process.env.OPENAI_API_KEY,
        fallbackAvailable: true,
        endpoint: '/api/ai/query-expansion'
      },
      competitors: {
        enabled: true,
        endpoint: '/api/competitors'
      },
      twitter: {
        enabled: !!process.env.TWITTER_BEARER_TOKEN,
        endpoint: '/api/twitter'
      },
      linkedin: {
        enabled: !!process.env.LINKEDIN_ACCESS_TOKEN,
        endpoint: '/api/linkedin'
      }
    },
    criticalApis: {
      openai: !!process.env.OPENAI_API_KEY,
      newsapi: !!process.env.NEWSAPI_KEY,
      serpapi: !!process.env.SERPAPI_KEY
    },
    recentUpdates: [
      'Query Expansion for intelligent category analysis',
      'Fixed sentiment calculations (always sum to 100%)',
      'Fixed GDP display issues',
      'Added Twitter/X integration',
      'Added LinkedIn integration',
      'Enhanced competitor analysis'
    ],
    testEndpoints: {
      queryExpansion: '/api/ai/query-expansion',
      status: '/api/config/status',
      health: '/api/health'
    }
  }
  
  return NextResponse.json(deploymentInfo, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
}
