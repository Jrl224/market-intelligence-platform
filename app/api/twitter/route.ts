import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface Tweet {
  id: string
  text: string
  author: {
    username: string
    name: string
    verified: boolean
  }
  metrics: {
    likes: number
    retweets: number
    replies: number
    views?: number
  }
  created_at: string
  url: string
}

interface TwitterData {
  tweets: Tweet[]
  trending: string[]
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
  influencers: Array<{
    username: string
    name: string
    followers: number
    engagement: number
  }>
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!process.env.TWITTER_BEARER_TOKEN) {
      // Return mock data for development
      return NextResponse.json(getMockTwitterData(query))
    }
    
    const headers = {
      'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    }
    
    // Search for tweets
    const searchParams = new URLSearchParams({
      query: `${query} -is:retweet lang:en`,
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'name,username,verified,public_metrics',
      'expansions': 'author_id',
      'max_results': '50'
    })
    
    try {
      const searchResponse = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?${searchParams}`,
        { headers, timeout: 10000 }
      )
      
      const tweets: Tweet[] = []
      const users = new Map()
      
      // Map users
      if (searchResponse.data.includes?.users) {
        searchResponse.data.includes.users.forEach((user: any) => {
          users.set(user.id, user)
        })
      }
      
      // Process tweets
      if (searchResponse.data.data) {
        searchResponse.data.data.forEach((tweet: any) => {
          const author = users.get(tweet.author_id)
          if (author) {
            tweets.push({
              id: tweet.id,
              text: tweet.text,
              author: {
                username: author.username,
                name: author.name,
                verified: author.verified || false
              },
              metrics: {
                likes: tweet.public_metrics.like_count,
                retweets: tweet.public_metrics.retweet_count,
                replies: tweet.public_metrics.reply_count,
                views: tweet.public_metrics.impression_count
              },
              created_at: tweet.created_at,
              url: `https://twitter.com/${author.username}/status/${tweet.id}`
            })
          }
        })
      }
      
      // Analyze sentiment
      const sentiment = analyzeTweetSentiment(tweets)
      
      // Find influencers (users with high engagement)
      const influencers = findInfluencers(tweets, users)
      
      // Get trending topics (would require trends endpoint)
      const trending = await getTrendingTopics(headers, query)
      
      return NextResponse.json({
        tweets: tweets.slice(0, 20),
        trending,
        sentiment,
        influencers
      })
      
    } catch (apiError: any) {
      console.error('Twitter API error:', apiError.response?.data || apiError.message)
      
      // Fallback to mock data on API error
      return NextResponse.json(getMockTwitterData(query))
    }
    
  } catch (error) {
    console.error('Twitter route error:', error)
    return NextResponse.json({
      error: 'Unable to fetch Twitter data',
      tweets: [],
      trending: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      influencers: []
    })
  }
}

function analyzeTweetSentiment(tweets: Tweet[]): { positive: number, neutral: number, negative: number } {
  if (tweets.length === 0) {
    return { positive: 0, neutral: 100, negative: 0 }
  }
  
  let positive = 0
  let negative = 0
  let neutral = 0
  
  tweets.forEach(tweet => {
    // Simple sentiment analysis based on engagement and keywords
    const text = tweet.text.toLowerCase()
    const engagementRate = (tweet.metrics.likes + tweet.metrics.retweets) / (tweet.metrics.views || 1)
    
    // Positive indicators
    const positiveWords = ['excellent', 'amazing', 'love', 'great', 'awesome', 'fantastic', 'good', 'best', 'perfect', 'wonderful']
    const negativeWords = ['terrible', 'awful', 'hate', 'bad', 'worst', 'horrible', 'poor', 'fail', 'disappointed', 'sucks']
    
    const hasPositive = positiveWords.some(word => text.includes(word))
    const hasNegative = negativeWords.some(word => text.includes(word))
    
    if (hasPositive && !hasNegative) {
      positive++
    } else if (hasNegative && !hasPositive) {
      negative++
    } else if (engagementRate > 0.05) {
      positive++
    } else if (engagementRate < 0.01) {
      negative++
    } else {
      neutral++
    }
  })
  
  const total = tweets.length
  const rawSentiment = {
    positive: (positive / total) * 100,
    neutral: (neutral / total) * 100,
    negative: (negative / total) * 100
  }
  
  // Ensure percentages sum to 100
  return ensurePercentagesSum100(rawSentiment)
}

function findInfluencers(tweets: Tweet[], users: Map<string, any>): any[] {
  const userEngagement = new Map()
  
  tweets.forEach(tweet => {
    const username = tweet.author.username
    const engagement = tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies
    
    if (userEngagement.has(username)) {
      userEngagement.get(username).engagement += engagement
      userEngagement.get(username).tweets++
    } else {
      userEngagement.set(username, {
        username,
        name: tweet.author.name,
        engagement,
        tweets: 1
      })
    }
  })
  
  return Array.from(userEngagement.values())
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5)
    .map(user => ({
      username: user.username,
      name: user.name,
      followers: 0, // Would need user lookup for this
      engagement: Math.round(user.engagement / user.tweets)
    }))
}

async function getTrendingTopics(headers: any, query: string): Promise<string[]> {
  // Twitter trends API requires location WOEID
  // For now, return query-related suggestions
  const baseTerms = query.toLowerCase().split(' ')
  return [
    `#${baseTerms[0]}`,
    `${query} news`,
    `${query} update`,
    `#${baseTerms.join('')}`,
    `${query} 2025`
  ]
}

function getMockTwitterData(query: string): TwitterData {
  const now = new Date()
  const mockTweets: Tweet[] = [
    {
      id: '1',
      text: `Just discovered ${query} and it's game-changing! The innovation in this space is incredible. #tech #innovation`,
      author: {
        username: 'techinsider',
        name: 'Tech Insider',
        verified: true
      },
      metrics: {
        likes: 1523,
        retweets: 342,
        replies: 89,
        views: 45200
      },
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://twitter.com/techinsider/status/1'
    },
    {
      id: '2',
      text: `Our analysis of ${query} shows promising growth potential. Market sentiment is strongly positive. Full report: [link]`,
      author: {
        username: 'marketanalyst',
        name: 'Market Analyst Pro',
        verified: true
      },
      metrics: {
        likes: 892,
        retweets: 215,
        replies: 47,
        views: 28900
      },
      created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://twitter.com/marketanalyst/status/2'
    },
    {
      id: '3',
      text: `Important developments in ${query} sector today. Companies are investing heavily in R&D. This could reshape the industry.`,
      author: {
        username: 'bizjournal',
        name: 'Business Journal',
        verified: true
      },
      metrics: {
        likes: 567,
        retweets: 123,
        replies: 34,
        views: 19800
      },
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://twitter.com/bizjournal/status/3'
    }
  ]
  
  return {
    tweets: mockTweets,
    trending: [
      `#${query.replace(/\s+/g, '')}`,
      `${query} news`,
      `${query} 2025`,
      `#innovation`,
      `#technology`
    ],
    sentiment: { positive: 65, neutral: 25, negative: 10 },
    influencers: [
      {
        username: 'techinsider',
        name: 'Tech Insider',
        followers: 850000,
        engagement: 1954
      },
      {
        username: 'marketanalyst',
        name: 'Market Analyst Pro',
        followers: 425000,
        engagement: 1154
      }
    ]
  }
}

function ensurePercentagesSum100(sentiment: {positive: number, neutral: number, negative: number}) {
  let positive = Math.round(sentiment.positive)
  let neutral = Math.round(sentiment.neutral)
  let negative = Math.round(sentiment.negative)
  
  const sum = positive + neutral + negative
  const diff = 100 - sum
  
  if (diff !== 0) {
    const values = [
      { key: 'positive', value: positive },
      { key: 'neutral', value: neutral },
      { key: 'negative', value: negative }
    ].sort((a, b) => b.value - a.value)
    
    if (values[0].key === 'positive') positive += diff
    else if (values[0].key === 'neutral') neutral += diff
    else negative += diff
  }
  
  return { positive, neutral, negative }
}