export interface ReportData {
  query: string
  timestamp: string
  summary: string
  sections: ReportSection[]
}

export interface ReportSection {
  id: string
  title: string
  type: 'trends' | 'news' | 'sentiment' | 'research' | 'patents' | 'economic' | 'insights' | 'financial'
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
}

export interface SentimentData {
  redditPosts: Array<{
    title: string
    content: string
    subreddit: string
    score: number
    url: string
    created: string
  }>
  youtubeSentiment: {
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
    url?: string
  }>
}

export interface PatentData {
  patents: Array<{
    title: string
    inventor: string
    assignee: string
    date: string
    abstract: string
    patentNumber: string
  }>
  totalCount: number
}

export interface EconomicData {
  indicators: Array<{
    name: string
    value: number
    unit: string
    date: string
    change: number
  }>
}

export interface InsightsData {
  opportunities: string[]
  risks: string[]
  recommendations: string[]
  futureOutlook: string
}

export interface FinancialData {
  stockData?: {
    symbol: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap: number
  }
  historicalPrices?: Array<{
    date: string
    close: number
  }>
}