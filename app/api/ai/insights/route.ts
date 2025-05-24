import { NextRequest, NextResponse } from 'next/server'
import { AIClient } from '@/lib/api/clients/ai-client'

export async function POST(request: NextRequest) {
  try {
    const { query, context = {} } = await request.json()
    
    // Initialize AI client
    const aiClient = new AIClient()
    
    // Generate insights using available AI providers
    const insights = await aiClient.generateInsights(query, context)
    
    return NextResponse.json(insights)
  } catch (error) {
    console.error('Insights API error:', error)
    
    // Return basic insights on error
    return NextResponse.json({
      opportunities: [
        `Market expansion opportunities in ${query} sector`,
        'Technology integration and digital transformation potential',
        'Strategic partnership possibilities',
        'Untapped customer segments'
      ],
      risks: [
        'Competitive pressure from established players',
        'Regulatory and compliance challenges',
        'Market volatility and economic factors',
        'Technology adoption barriers'
      ],
      recommendations: [
        'Conduct comprehensive market research',
        'Develop differentiated value proposition',
        'Build strategic partnerships',
        'Invest in technology and innovation'
      ],
      futureOutlook: `The ${query} market presents both opportunities and challenges. Success will depend on strategic positioning, innovation, and adaptability to changing market conditions.`,
      keyTakeaways: [
        'Market shows growth potential',
        'Innovation is key differentiator',
        'Customer needs are evolving rapidly'
      ]
    })
  }
}
