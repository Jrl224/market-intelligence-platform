import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface Competitor {
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
    twitter?: { followers: number, engagement: number }
    linkedin?: { followers: number, employees: number }
    facebook?: { likes: number }
  }
}

interface CompetitorAnalysis {
  competitors: Competitor[]
  marketOverview: {
    totalMarketSize: string
    growthRate: string
    keyTrends: string[]
    marketLeaders: Array<{ name: string, share: number }>
  }
  competitivePositioning: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  recommendations: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { query, industry, company } = await request.json()
    
    // Identify competitors based on query
    const competitors = await identifyCompetitors(query, industry)
    
    // Analyze each competitor
    const competitorData = await Promise.all(
      competitors.map(comp => analyzeCompetitor(comp, query))
    )
    
    // Get market overview
    const marketOverview = await getMarketOverview(query, industry)
    
    // Perform SWOT analysis
    const competitivePositioning = await performSWOTAnalysis(query, competitorData, company)
    
    // Generate strategic recommendations
    const recommendations = generateRecommendations(competitorData, competitivePositioning)
    
    return NextResponse.json({
      competitors: competitorData,
      marketOverview,
      competitivePositioning,
      recommendations
    })
    
  } catch (error) {
    console.error('Competitor analysis error:', error)
    
    // Return mock data for development
    return NextResponse.json(getMockCompetitorData(request))
  }
}

async function identifyCompetitors(query: string, industry?: string): Promise<string[]> {
  // In production, this would use various APIs to identify competitors
  // For now, return mock competitor names based on industry
  
  const competitorMap: { [key: string]: string[] } = {
    'cleaning products': ['Procter & Gamble', 'Unilever', 'Henkel', 'SC Johnson', 'Clorox'],
    'personal care': ['Procter & Gamble', 'Unilever', 'Johnson & Johnson', 'L\'Oréal', 'Colgate-Palmolive'],
    'technology': ['Microsoft', 'Google', 'Apple', 'Amazon', 'Meta'],
    'default': ['Competitor A', 'Competitor B', 'Competitor C']
  }
  
  const key = industry?.toLowerCase() || 'default'
  return competitorMap[key] || competitorMap['default']
}

async function analyzeCompetitor(competitorName: string, query: string): Promise<Competitor> {
  // In production, aggregate data from multiple sources:
  // - Company databases (Crunchbase, PitchBook)
  // - News APIs
  // - Social media APIs
  // - Web scraping
  
  // Mock implementation
  const competitorData: { [key: string]: Partial<Competitor> } = {
    'Procter & Gamble': {
      domain: 'pg.com',
      description: 'Multinational consumer goods corporation',
      marketShare: 18.5,
      founded: '1837',
      employees: '100,000+',
      revenue: '$80.2B',
      headquarters: 'Cincinnati, OH',
      products: ['Tide', 'Pampers', 'Gillette', 'Oral-B', 'Dawn'],
      strengths: ['Brand portfolio', 'Global distribution', 'R&D capabilities', 'Marketing expertise'],
      weaknesses: ['High price points', 'Slow innovation cycles', 'Complex organization']
    },
    'Unilever': {
      domain: 'unilever.com',
      description: 'British multinational consumer goods company',
      marketShare: 15.2,
      founded: '1929',
      employees: '127,000+',
      revenue: '€60.1B',
      headquarters: 'London, UK',
      products: ['Dove', 'Axe', 'Lipton', 'Hellmann\'s', 'Ben & Jerry\'s'],
      strengths: ['Sustainability focus', 'Emerging markets presence', 'Brand diversity'],
      weaknesses: ['Lower margins', 'Portfolio complexity', 'Regional variations']
    }
  }
  
  const baseData = competitorData[competitorName] || {
    domain: `${competitorName.toLowerCase().replace(/\s+/g, '')}.com`,
    description: `Leading company in the ${query} industry`,
    products: ['Product 1', 'Product 2', 'Product 3'],
    strengths: ['Market presence', 'Brand recognition', 'Innovation'],
    weaknesses: ['Limited reach', 'Higher costs', 'Legacy systems']
  }
  
  return {
    name: competitorName,
    ...baseData,
    recentNews: [
      {
        title: `${competitorName} Announces New ${query} Innovation`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        summary: `${competitorName} unveiled their latest advancement in ${query} technology, aiming to capture more market share.`
      },
      {
        title: `${competitorName} Reports Strong Q4 Earnings`,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        summary: 'Company exceeds analyst expectations with 12% revenue growth year-over-year.'
      }
    ],
    socialMetrics: {
      twitter: { followers: Math.floor(Math.random() * 500000) + 100000, engagement: Math.random() * 5 + 1 },
      linkedin: { followers: Math.floor(Math.random() * 1000000) + 200000, employees: Math.floor(Math.random() * 50000) + 10000 }
    }
  } as Competitor
}

async function getMarketOverview(query: string, industry?: string): Promise<any> {
  // In production, aggregate market data from:
  // - Industry reports
  // - Market research firms
  // - Government statistics
  
  return {
    totalMarketSize: '$45.3 billion',
    growthRate: '6.8% CAGR',
    keyTrends: [
      'Sustainability and eco-friendly products',
      'Direct-to-consumer channels growth',
      'Premium product segments expansion',
      'Digital marketing dominance',
      'Supply chain optimization'
    ],
    marketLeaders: [
      { name: 'Procter & Gamble', share: 18.5 },
      { name: 'Unilever', share: 15.2 },
      { name: 'Henkel', share: 8.7 },
      { name: 'Church & Dwight', share: 6.3 },
      { name: 'Others', share: 51.3 }
    ]
  }
}

async function performSWOTAnalysis(
  query: string, 
  competitors: Competitor[], 
  company?: string
): Promise<any> {
  // Analyze competitive landscape to identify SWOT
  
  return {
    strengths: [
      'Strong brand heritage and consumer trust',
      'Efficient manufacturing and distribution',
      'Innovation in eco-friendly formulations',
      'Competitive pricing strategy'
    ],
    weaknesses: [
      'Limited digital marketing presence',
      'Smaller R&D budget vs major competitors',
      'Regional market concentration',
      'Dependence on traditional retail channels'
    ],
    opportunities: [
      'Growing demand for sustainable products',
      'E-commerce channel expansion',
      'Emerging markets penetration',
      'Private label partnerships',
      'Adjacent category expansion'
    ],
    threats: [
      'Intense competition from global giants',
      'Raw material cost inflation',
      'Changing consumer preferences',
      'Regulatory changes',
      'Economic uncertainty'
    ]
  }
}

function generateRecommendations(
  competitors: Competitor[], 
  swot: any
): string[] {
  return [
    'Accelerate digital transformation and e-commerce capabilities to compete with digitally-native brands',
    'Invest in sustainable product innovation to differentiate from traditional competitors',
    'Develop strategic partnerships for technology and distribution channel expansion',
    'Focus on niche markets where large competitors have less presence',
    'Implement agile product development to respond faster to market trends',
    'Strengthen brand storytelling and content marketing to build emotional connections',
    'Consider acquisition opportunities in complementary categories',
    'Optimize supply chain for cost efficiency and resilience'
  ]
}

function getMockCompetitorData(request: NextRequest): CompetitorAnalysis {
  const mockCompetitors: Competitor[] = [
    {
      name: 'Procter & Gamble',
      domain: 'pg.com',
      description: 'Global leader in consumer goods with extensive portfolio',
      marketShare: 18.5,
      founded: '1837',
      employees: '100,000+',
      revenue: '$80.2B',
      funding: 'Public (NYSE: PG)',
      headquarters: 'Cincinnati, OH',
      products: ['Tide', 'Pampers', 'Gillette', 'Oral-B', 'Dawn', 'Olay', 'Crest'],
      strengths: [
        'Massive brand portfolio',
        'Global distribution network',
        'Superior R&D capabilities',
        'Marketing expertise and budget'
      ],
      weaknesses: [
        'Premium pricing',
        'Organizational complexity',
        'Slower innovation cycles',
        'Traditional retail dependence'
      ],
      recentNews: [
        {
          title: 'P&G Launches New Sustainable Packaging Initiative',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          summary: 'Company commits to 100% recyclable packaging by 2030',
          url: 'https://example.com/pg-sustainability'
        },
        {
          title: 'P&G Reports Strong Q1 Earnings Beat',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          summary: 'Organic sales growth of 7% exceeds analyst expectations',
          url: 'https://example.com/pg-earnings'
        }
      ],
      socialMetrics: {
        twitter: { followers: 456000, engagement: 3.2 },
        linkedin: { followers: 892000, employees: 98547 },
        facebook: { likes: 2340000 }
      }
    },
    {
      name: 'Unilever',
      domain: 'unilever.com',
      description: 'Multinational consumer goods company with sustainability focus',
      marketShare: 15.2,
      founded: '1929',
      employees: '127,000+',
      revenue: '€60.1B',
      funding: 'Public (LSE: ULVR)',
      headquarters: 'London, UK',
      products: ['Dove', 'Axe', 'Lipton', 'Hellmann\'s', 'Ben & Jerry\'s', 'Vaseline'],
      strengths: [
        'Sustainability leadership',
        'Strong emerging markets presence',
        'Purpose-driven brands',
        'Innovation in natural ingredients'
      ],
      weaknesses: [
        'Lower profit margins',
        'Portfolio complexity',
        'Slower growth in developed markets'
      ],
      recentNews: [
        {
          title: 'Unilever Accelerates Digital Commerce Strategy',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          summary: 'Company targets 25% of sales from e-commerce by 2025',
          url: 'https://example.com/unilever-digital'
        }
      ],
      socialMetrics: {
        twitter: { followers: 234000, engagement: 2.8 },
        linkedin: { followers: 1230000, employees: 125634 }
      }
    },
    {
      name: 'Henkel',
      domain: 'henkel.com',
      description: 'German chemical and consumer goods company',
      marketShare: 8.7,
      founded: '1876',
      employees: '52,000+',
      revenue: '€22.4B',
      headquarters: 'Düsseldorf, Germany',
      products: ['Persil', 'Schwarzkopf', 'Loctite', 'Dial', 'Purex'],
      strengths: [
        'Strong adhesives business',
        'Innovation capabilities',
        'European market leadership',
        'B2B and B2C diversification'
      ],
      weaknesses: [
        'Limited US market share',
        'Brand awareness gaps',
        'Distribution challenges'
      ],
      recentNews: [
        {
          title: 'Henkel Invests €130M in New Innovation Center',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          summary: 'State-of-the-art facility to accelerate product development',
          url: 'https://example.com/henkel-innovation'
        }
      ],
      socialMetrics: {
        twitter: { followers: 89000, engagement: 2.1 },
        linkedin: { followers: 456000, employees: 51234 }
      }
    }
  ]
  
  return {
    competitors: mockCompetitors,
    marketOverview: {
      totalMarketSize: '$45.3 billion',
      growthRate: '6.8% CAGR (2023-2028)',
      keyTrends: [
        'Shift to eco-friendly and sustainable products',
        'Growth in private label offerings',
        'E-commerce channel expansion',
        'Premiumization in key categories',
        'Consolidation through M&A activity'
      ],
      marketLeaders: [
        { name: 'Procter & Gamble', share: 18.5 },
        { name: 'Unilever', share: 15.2 },
        { name: 'Henkel', share: 8.7 },
        { name: 'Church & Dwight', share: 6.3 },
        { name: 'Others', share: 51.3 }
      ]
    },
    competitivePositioning: {
      strengths: [
        'Heritage brands with strong consumer loyalty',
        'Efficient manufacturing and supply chain',
        'Growing portfolio of natural products',
        'Strong relationships with major retailers'
      ],
      weaknesses: [
        'Smaller scale vs global competitors',
        'Limited international presence',
        'Lower marketing budget',
        'Gaps in premium segments'
      ],
      opportunities: [
        'Rapidly growing sustainable products market',
        'Direct-to-consumer channel development',
        'International expansion potential',
        'Strategic acquisitions in adjacent categories',
        'Private label partnerships with major retailers'
      ],
      threats: [
        'Aggressive competition from global giants',
        'Rising raw material and logistics costs',
        'Shifting consumer preferences',
        'Retailer consolidation and bargaining power',
        'Economic uncertainty affecting consumer spending'
      ]
    },
    recommendations: [
      'Double down on sustainability initiatives to differentiate from larger competitors',
      'Invest in direct-to-consumer capabilities and digital marketing',
      'Explore strategic partnerships or acquisitions in high-growth categories',
      'Develop premium product lines to improve margins',
      'Strengthen innovation pipeline with focus on natural and eco-friendly formulations',
      'Expand private label partnerships to gain scale',
      'Consider international expansion in select high-growth markets',
      'Optimize product portfolio to focus on highest-margin categories'
    ]
  }
}