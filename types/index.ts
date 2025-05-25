import type { QueryExpansion } from '@/app/api/ai/query-expansion/route'

export interface ReportData {
  query: string
  timestamp: string
  summary: string
  sections: ReportSection[]
  queryExpansion?: QueryExpansion | null
}

export interface ReportSection {
  id: string
  title: string
  type: 'trends' | 'news' | 'sentiment' | 'research' | 'patents' | 'economic' | 'financial' | 'insights' | 'twitter' | 'linkedin' | 'competitors' | 'query-expansion'
  data: any
  visible: boolean
  loading?: boolean
  error?: string
}

export interface TrendsData {
  timelineData?: Array<{
    date: string
    value: number
  }>
  relatedQueries?: string[]
  relatedTopics?: Array<{
    topic: string
    value: number
  }>
  geographicDistribution?: Array<{
    location: string
    interest: number
  }>
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
}

export interface NewsData {
  articles: NewsArticle[]
}

export interface SentimentData {
  overallSentiment: {
    positive: number
    neutral: number
    negative: number
  }
  redditPosts?: Array<{
    title: string
    content: string
    subreddit: string
    score: number
    comments: number
    url: string
    author: string
    created: string
  }>
  youtubeSentiment?: {
    positive: number
    neutral: number
    negative: number
  }
  redditSentiment?: {
    positive: number
    neutral: number
    negative: number
  }
}

export interface ResearchPaper {
  title: string
  authors: string[]
  abstract: string
  year: number
  doi?: string
  url?: string
  citations?: number
}

export interface ResearchData {
  papers: ResearchPaper[]
}

export interface Patent {
  title: string
  patentNumber: string
  inventor: string
  assignee: string
  date: string
  abstract: string
  url?: string
}

export interface PatentData {
  patents: Patent[]
  totalPatents?: number
}

export interface EconomicIndicator {
  name: string
  value: number
  unit: string
  date: string
  change?: number
  source?: string
}

export interface EconomicData {
  indicators: EconomicIndicator[]
}

export interface FinancialData {
  stocks?: Array<{
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap?: number
    pe?: number
    high52Week?: number
    low52Week?: number
  }>
  marketIndices?: Array<{
    name: string
    value: number
    change: number
    changePercent: number
  }>
  sectorPerformance?: {
    [sector: string]: {
      change: number
      performance: string
    }
  }
  message?: string
}

export interface InsightsData {
  opportunities: string[]
  risks: string[]
  recommendations: string[]
  futureOutlook: string
}

export interface TwitterData {
  tweets: Array<{
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
  }>
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

export interface LinkedInData {
  posts: Array<{
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
  }>
  companies: Array<{
    name: string
    industry: string
    size: string
    followers: number
    description: string
    specialties: string[]
  }>
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

export interface CompetitorData {
  competitors: Array<{
    name: string
    domain: string
    description: string
    marketShare?: number
    founded?: string
    employees?: string
    revenue?: string
    funding?: string
    headquarters?: string
    products: string[]
    strengths: string[]
    weaknesses: string[]
    recentNews: Array<{
      title: string
      date: string
      summary: string
      url?: string
    }>
    socialMetrics?: {
      twitter?: { followers: number; engagement: number }
      linkedin?: { followers: number; employees: number }
      facebook?: { likes: number }
    }
  }>
  marketOverview: {
    totalMarketSize: string
    growthRate: string
    keyTrends: string[]
    marketLeaders: Array<{ name: string; share: number }>
  }
  competitivePositioning: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  recommendations: string[]
}