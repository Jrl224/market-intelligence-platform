import axios from 'axios'

interface RedditPost {
  title: string
  selftext: string
  subreddit: string
  score: number
  num_comments: number
  created_utc: number
  permalink: string
  author: string
}

interface RedditSearchResponse {
  data: {
    children: Array<{
      data: RedditPost
    }>
  }
}

export class RedditClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor(
    private clientId: string,
    private clientSecret: string
  ) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'MarketIntelligencePlatform/1.0'
        }
      }
    )

    this.accessToken = response.data.access_token
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000 // Refresh 1 min early
    
    return this.accessToken
  }

  async searchPosts(query: string, limit: number = 10): Promise<RedditPost[]> {
    try {
      const token = await this.getAccessToken()
      
      const response = await axios.get<RedditSearchResponse>(
        'https://oauth.reddit.com/search.json',
        {
          params: {
            q: query,
            sort: 'relevance',
            limit: limit,
            type: 'link'
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'MarketIntelligencePlatform/1.0'
          }
        }
      )

      return response.data.data.children.map(child => ({
        ...child.data,
        url: `https://reddit.com${child.data.permalink}`
      }))
    } catch (error) {
      console.error('Reddit API error:', error)
      return []
    }
  }

  async getSubredditPosts(subreddit: string, query: string, limit: number = 5): Promise<RedditPost[]> {
    try {
      const token = await this.getAccessToken()
      
      const response = await axios.get<RedditSearchResponse>(
        `https://oauth.reddit.com/r/${subreddit}/search.json`,
        {
          params: {
            q: query,
            restrict_sr: 'on',
            sort: 'relevance',
            limit: limit
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'MarketIntelligencePlatform/1.0'
          }
        }
      )

      return response.data.data.children.map(child => ({
        ...child.data,
        url: `https://reddit.com${child.data.permalink}`
      }))
    } catch (error) {
      console.error(`Reddit API error for r/${subreddit}:`, error)
      return []
    }
  }

  async analyzeSentiment(posts: RedditPost[]): Promise<{ positive: number; neutral: number; negative: number }> {
    // Simple sentiment analysis based on scores and engagement
    // In production, you'd use a proper NLP service
    let positive = 0
    let negative = 0
    let neutral = 0
    
    posts.forEach(post => {
      const engagementScore = post.score + (post.num_comments * 2)
      
      if (engagementScore > 100) {
        positive++
      } else if (engagementScore < 20) {
        negative++
      } else {
        neutral++
      }
    })
    
    const total = posts.length || 1
    
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100)
    }
  }
}
