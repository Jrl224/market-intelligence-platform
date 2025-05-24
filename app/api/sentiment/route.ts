import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Reddit posts (mock data - would need proper Reddit API integration)
    const redditPosts = [
      {
        title: `Discussion about ${query}`,
        content: 'Great insights on the latest developments...',
        subreddit: 'technology',
        score: 245,
        url: 'https://reddit.com/r/technology',
        created: new Date().toISOString()
      },
      {
        title: `${query} - What\'s your experience?`,
        content: 'I\'ve been following this closely...',
        subreddit: 'business',
        score: 189,
        url: 'https://reddit.com/r/business',
        created: new Date().toISOString()
      }
    ]
    
    // YouTube sentiment (mock data - would need YouTube API integration)
    const youtubeSentiment = {
      positive: 65,
      neutral: 25,
      negative: 10
    }
    
    return NextResponse.json({
      redditPosts,
      youtubeSentiment
    })
  } catch (error) {
    console.error('Sentiment API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sentiment data' },
      { status: 500 }
    )
  }
}