import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!process.env.SERPAPI_KEY) {
      throw new Error('SERPAPI_KEY is not configured')
    }
    
    // Fetch Google Trends data via SerpAPI
    const trendsResponse = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_trends',
        q: query,
        api_key: process.env.SERPAPI_KEY,
        data_type: 'TIMESERIES',
        tz: 360
      }
    })
    
    // Fetch related queries
    const relatedResponse = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_trends',
        q: query,
        api_key: process.env.SERPAPI_KEY,
        data_type: 'RELATED_QUERIES'
      }
    })
    
    // Process the data
    const searchInterest = trendsResponse.data.interest_over_time?.timeline_data?.map(item => ({
      date: item.date,
      value: item.values?.[0]?.value || 0
    })) || []
    
    const relatedQueries = relatedResponse.data.related_queries?.rising?.map(item => item.query) || []
    
    // Mock geographic data (would need additional API calls for real data)
    const geographicDistribution = [
      { location: 'United States', interest: 100 },
      { location: 'United Kingdom', interest: 75 },
      { location: 'Canada', interest: 60 },
      { location: 'Australia', interest: 45 },
      { location: 'Germany', interest: 40 }
    ]
    
    return NextResponse.json({
      searchInterest,
      relatedQueries,
      geographicDistribution
    })
  } catch (error) {
    console.error('Trends API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends data' },
      { status: 500 }
    )
  }
}