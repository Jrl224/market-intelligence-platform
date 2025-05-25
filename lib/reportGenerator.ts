import type { ReportData, ReportSection } from '@/types'

export async function generateReport(query: string): Promise<ReportData> {
  const timestamp = new Date().toISOString()
  
  // Determine if we need industry/company specific data
  const isCompanyQuery = /company|corporation|inc|ltd|llc|competitor/i.test(query)
  const industry = detectIndustry(query)
  
  // Fetch data from all sources in parallel
  const fetchPromises = [
    generateSummary(query),
    fetchTrends(query),
    fetchNews(query),
    fetchSentiment(query),
    fetchResearch(query),
    fetchPatents(query),
    fetchEconomic(query),
    fetchFinancial(query),
    fetchTwitter(query),
    fetchLinkedIn(query),
    generateInsights(query)
  ]
  
  // Add competitor analysis if relevant
  if (isCompanyQuery || industry) {
    fetchPromises.push(fetchCompetitors(query, industry))
  }
  
  const results = await Promise.allSettled(fetchPromises)
  
  // Destructure results
  const [
    summary,
    trends,
    news,
    sentiment,
    research,
    patents,
    economic,
    financial,
    twitter,
    linkedin,
    insights,
    competitors
  ] = results
  
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
  
  // Add Twitter section
  if (twitter.status === 'fulfilled' && twitter.value) {
    sections.push({
      id: 'twitter',
      title: 'Twitter/X Analysis',
      type: 'twitter',
      data: twitter.value,
      visible: true
    })
  }
  
  // Add LinkedIn section
  if (linkedin.status === 'fulfilled' && linkedin.value) {
    sections.push({
      id: 'linkedin',
      title: 'LinkedIn Professional Insights',
      type: 'linkedin',
      data: linkedin.value,
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
  
  // Add competitor analysis if available
  if (competitors && competitors.status === 'fulfilled' && competitors.value) {
    sections.push({
      id: 'competitors',
      title: 'Competitor Analysis',
      type: 'competitors',
      data: competitors.value,
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

// Helper function to detect industry
function detectIndustry(query: string): string | null {
  const queryLower = query.toLowerCase()
  
  const industryKeywords: { [key: string]: string[] } = {
    'cleaning products': ['cleaning', 'cleaner', 'detergent', 'soap', 'sanitizer', 'oxyclean', 'arm & hammer', 'arm and hammer'],
    'personal care': ['personal care', 'cosmetics', 'beauty', 'skincare', 'haircare', 'hygiene'],
    'technology': ['tech', 'software', 'saas', 'ai', 'cloud', 'digital', 'platform'],
    'consumer goods': ['consumer', 'cpg', 'fmcg', 'retail', 'products'],
    'pharmaceuticals': ['pharma', 'drug', 'medicine', 'healthcare', 'biotech']
  }
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      return industry
    }
  }
  
  return null
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

async function fetchTwitter(query: string) {
  const response = await fetch('/api/twitter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchLinkedIn(query: string) {
  const response = await fetch('/api/linkedin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return response.json()
}

async function fetchCompetitors(query: string, industry: string | null) {
  const response = await fetch('/api/competitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, industry })
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