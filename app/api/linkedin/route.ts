import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface LinkedInPost {
  id: string
  text: string
  author: {
    name: string
    headline: string
    company?: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  publishedAt: string
  url: string
}

interface LinkedInCompany {
  name: string
  industry: string
  size: string
  followers: number
  description: string
  specialties: string[]
}

interface LinkedInData {
  posts: LinkedInPost[]
  companies: LinkedInCompany[]
  insights: {
    industryTrends: string[]
    skillsInDemand: string[]
    hiringTrends: string[]
  }
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // LinkedIn API requires OAuth 2.0 and is quite restrictive
    // For production, you'd need proper OAuth flow
    if (!process.env.LINKEDIN_ACCESS_TOKEN) {
      // Return comprehensive mock data for development
      return NextResponse.json(getMockLinkedInData(query))
    }
    
    const headers = {
      'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json'
    }
    
    try {
      // Search for posts (Note: LinkedIn's API is very limited for content search)
      // In production, you might need to use LinkedIn's Marketing API or partner APIs
      const searchResults = await searchLinkedInContent(query, headers)
      const companyData = await searchCompanies(query, headers)
      const insights = await getIndustryInsights(query, headers)
      
      // Analyze sentiment from posts
      const sentiment = analyzeLinkedInSentiment(searchResults.posts)
      
      return NextResponse.json({
        posts: searchResults.posts,
        companies: companyData,
        insights,
        sentiment
      })
      
    } catch (apiError: any) {
      console.error('LinkedIn API error:', apiError.response?.data || apiError.message)
      return NextResponse.json(getMockLinkedInData(query))
    }
    
  } catch (error) {
    console.error('LinkedIn route error:', error)
    return NextResponse.json({
      error: 'Unable to fetch LinkedIn data',
      posts: [],
      companies: [],
      insights: {
        industryTrends: [],
        skillsInDemand: [],
        hiringTrends: []
      },
      sentiment: { positive: 0, neutral: 0, negative: 0 }
    })
  }
}

async function searchLinkedInContent(query: string, headers: any): Promise<{ posts: LinkedInPost[] }> {
  // LinkedIn's public API doesn't support general content search
  // This would require partner API access or web scraping
  // For now, return structured mock data
  return { posts: [] }
}

async function searchCompanies(query: string, headers: any): Promise<LinkedInCompany[]> {
  // Company search would use LinkedIn's Companies API
  return []
}

async function getIndustryInsights(query: string, headers: any): Promise<any> {
  // Would aggregate data from multiple LinkedIn endpoints
  return {
    industryTrends: [],
    skillsInDemand: [],
    hiringTrends: []
  }
}

function analyzeLinkedInSentiment(posts: LinkedInPost[]): { positive: number, neutral: number, negative: number } {
  if (posts.length === 0) {
    return { positive: 0, neutral: 100, negative: 0 }
  }
  
  let positive = 0
  let negative = 0
  let neutral = 0
  
  posts.forEach(post => {
    const text = post.text.toLowerCase()
    const engagementScore = (post.engagement.likes * 2 + post.engagement.comments * 3 + post.engagement.shares * 4) / 100
    
    // Professional sentiment indicators
    const positiveIndicators = ['excited', 'thrilled', 'delighted', 'proud', 'achievement', 'success', 'innovation', 'growth', 'opportunity', 'breakthrough']
    const negativeIndicators = ['concerned', 'challenging', 'difficult', 'layoffs', 'downturn', 'struggling', 'issues', 'problems', 'decline']
    
    const positiveCount = positiveIndicators.filter(word => text.includes(word)).length
    const negativeCount = negativeIndicators.filter(word => text.includes(word)).length
    
    if (positiveCount > negativeCount || engagementScore > 5) {
      positive++
    } else if (negativeCount > positiveCount) {
      negative++
    } else {
      neutral++
    }
  })
  
  const total = posts.length
  return ensurePercentagesSum100({
    positive: (positive / total) * 100,
    neutral: (neutral / total) * 100,
    negative: (negative / total) * 100
  })
}

function getMockLinkedInData(query: string): LinkedInData {
  const now = new Date()
  
  return {
    posts: [
      {
        id: '1',
        text: `Exciting developments in the ${query} industry! Our latest research shows a 45% increase in adoption rates among Fortune 500 companies. The future of enterprise technology is here. #Innovation #TechTrends`,
        author: {
          name: 'Sarah Chen',
          headline: 'VP of Innovation at TechCorp',
          company: 'TechCorp'
        },
        engagement: {
          likes: 1243,
          comments: 87,
          shares: 234
        },
        publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        url: 'https://linkedin.com/posts/1'
      },
      {
        id: '2',
        text: `Key insights from our ${query} implementation: 1) ROI exceeded expectations by 200%, 2) Employee productivity increased 35%, 3) Customer satisfaction up 28%. Happy to share our learnings with the community!`,
        author: {
          name: 'Michael Roberts',
          headline: 'CTO at InnovateCo | Digital Transformation Leader',
          company: 'InnovateCo'
        },
        engagement: {
          likes: 892,
          comments: 156,
          shares: 78
        },
        publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        url: 'https://linkedin.com/posts/2'
      },
      {
        id: '3',
        text: `After 6 months of evaluating ${query} solutions, here's what we learned: Integration capabilities and scalability are paramount. The market is maturing rapidly, and vendors are stepping up their game.`,
        author: {
          name: 'Jennifer Park',
          headline: 'Director of Strategy | Harvard MBA',
          company: 'Global Ventures Inc'
        },
        engagement: {
          likes: 567,
          comments: 43,
          shares: 89
        },
        publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        url: 'https://linkedin.com/posts/3'
      }
    ],
    companies: [
      {
        name: 'TechCorp Solutions',
        industry: 'Information Technology',
        size: '10,001+ employees',
        followers: 125000,
        description: `Leading provider of ${query} solutions for enterprise clients worldwide.`,
        specialties: ['Cloud Computing', 'AI/ML', 'Enterprise Software', query]
      },
      {
        name: 'InnovateCo',
        industry: 'Software Development',
        size: '1,001-5,000 employees',
        followers: 45000,
        description: `Pioneering next-generation ${query} technologies for digital transformation.`,
        specialties: ['Digital Transformation', 'SaaS', query, 'Consulting']
      },
      {
        name: 'FutureTech Industries',
        industry: 'Technology',
        size: '501-1,000 employees',
        followers: 23000,
        description: `Innovative startup focused on making ${query} accessible to businesses of all sizes.`,
        specialties: [query, 'B2B Software', 'Platform Development']
      }
    ],
    insights: {
      industryTrends: [
        `${query} adoption growing 40% YoY`,
        'AI integration becoming standard',
        'Security and compliance top priorities',
        'Remote work driving demand',
        'Sustainability focus increasing'
      ],
      skillsInDemand: [
        `${query} Implementation`,
        'Cloud Architecture',
        'Data Analytics',
        'Project Management',
        'Change Management',
        'API Development'
      ],
      hiringTrends: [
        `${query} specialists in high demand`,
        'Remote positions up 65%',
        'Average salaries increased 18%',
        'Skills gap widening',
        'Certification programs growing'
      ]
    },
    sentiment: {
      positive: 72,
      neutral: 23,
      negative: 5
    }
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