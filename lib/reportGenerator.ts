import type { ReportData, ReportSection } from '@/types'

export async function generateReport(query: string): Promise<ReportData> {
  const timestamp = new Date().toISOString()
  
  // Fetch data from all sources in parallel
  const [
    summary,
    trends,
    news,
    sentiment,
    research,
    patents,
    economic,
    financial,
    insights
  ] = await Promise.allSettled([
    generateSummary(query),
    fetchTrends(query),
    fetchNews(query),
    fetchSentiment(query),
    fetchResearch(query),
    fetchPatents(query),
    fetchEconomic(query),
    fetchFinancial(query),
    generateInsights(query)
  ])
  
  const sections: ReportSection[] = []
  
  // Add sections based on successful data fetches
  if (trends.status === 'fulfilled' && trends.value) {
    sections.push({
      id: 'trends',
      title: 'Market Trends & Search Interest',
      type: 'trends',
      data: trends.value,
      visible: true
    })
  }
  
  if (news.status === 'fulfilled' && news.value) {
    sections.push({
      id: 'news',
      title: 'Latest News & Developments',
      type: 'news',
      data: news.value,
      visible: true
    })
  }
  
  if (sentiment.status === 'fulfilled' && sentiment.value) {
    sections.push({
      id: 'sentiment',
      title: 'Community Sentiment',
      type: 'sentiment',
      data: sentiment.value,
      visible: true
    })
  }
  
  if (research.status === 'fulfilled' && research.value) {
    sections.push({
      id: 'research',
      title: 'Academic Research',
      type: 'research',
      data: research.value,
      visible: true
    })
  }
  
  if (patents.status === 'fulfilled' && patents.value) {
    sections.push({
      id: 'patents',
      title: 'Patent Activity',
      type: 'patents',
      data: patents.value,
      visible: true
    })
  }
  
  if (economic.status === 'fulfilled' && economic.value) {
    sections.push({
      id: 'economic',
      title: 'Economic Indicators',
      type: 'economic',
      data: economic.value,
      visible: true
    })
  }
  
  if (financial.status === 'fulfilled' && financial.value) {
    sections.push({
      id: 'financial',
      title: 'Financial Data',
      type: 'financial',
      data: financial.value,
      visible: true
    })
  }
  
  if (insights.status === 'fulfilled' && insights.value) {
    sections.push({
      id: 'insights',
      title: 'AI-Generated Insights',
      type: 'insights',
      data: insights.value,
      visible: true
    })
  }
  
  return {
    query,
    timestamp,
    summary: summary.status === 'fulfilled' ? summary.value : 'Analysis complete.',
    sections
  }
}

// API Functions
async function generateSummary(query: string): Promise<string> {
  const response = await fetch('/api/ai/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  const data = await response.json()
  return data.summary
}

async function fetchTrends(query: string) {
  const response = await fetch('/api/trends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchNews(query: string) {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchSentiment(query: string) {
  const response = await fetch('/api/sentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchResearch(query: string) {
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchPatents(query: string) {
  const response = await fetch('/api/patents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchEconomic(query: string) {
  const response = await fetch('/api/economic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchFinancial(query: string) {
  const response = await fetch('/api/financial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function generateInsights(query: string) {
  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}