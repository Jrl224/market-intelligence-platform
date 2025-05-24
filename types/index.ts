export interface ReportData {
  query: string
  timestamp: string
  summary: string
  sections: ReportSection[]
}

export interface ReportSection {
  id: string
  title: string
  type: 'trends' | 'news' | 'sentiment' | 'research' | 'patents' | 'economic' | 'financial' | 'insights'
  data: any
  visible: boolean
}

export interface TrendsData {
  searchInterest: Array<{
    date: string
    value: number
  }>
  relatedQueries: string[]
  geographicDistribution: Array<{
    location: string
    interest: number
  }>
}

export interface NewsData {
  articles: Array<{
    title: string
    description: string
    url: string
    source: string
    publishedAt: string
    imageUrl?: string
  }>
  sources?: string[]
  message?: string
}

export interface SentimentData {
  redditPosts?: Array<{
    title: string
    content: string
    subreddit: string
    score: number
    comments?: number
    url: string
    author?: string
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
  overallSentiment?: {
    positive: number
    neutral: number
    negative: number
  }
}

export interface ResearchData {
  papers: Array<{
    title: string
    authors: string[]
    abstract: string
    year: number
    doi?: string
    url: string
    citations?: number
    source?: string
  }>
}

export interface PatentData {
  totalPatents?: number
  patents: Array<{
    title: string
    patentNumber: string
    date: string
    inventor: string
    assignee: string
    abstract?: string
    url?: string
  }>
  message?: string
}

export interface EconomicData {
  indicators: Array<{
    name: string
    value: number
    unit: string
    date: string
    change?: number
    source?: string
  }>
  errors?: string[]
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
  sectorPerformance?: any
  marketIndices?: Array<{
    name: string
    value: number
    change: number
    changePercent: number
  }>
  message?: string
  suggestion?: string
}

export interface InsightsData {
  opportunities: string[]
  risks: string[]
  recommendations: string[]
  futureOutlook: string
  keyTakeaways?: string[]
  competitiveAnalysis?: string
  marketSize?: string
}
