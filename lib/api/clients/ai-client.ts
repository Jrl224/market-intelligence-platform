import axios from 'axios'

export interface MarketInsights {
  opportunities: string[]
  risks: string[]
  recommendations: string[]
  futureOutlook: string
  keyTakeaways?: string[]
  competitiveAnalysis?: string
  marketSize?: string
}

export class AIClient {
  async generateInsights(query: string, context: any = {}): Promise<MarketInsights> {
    // Try multiple AI providers in order of preference
    const providers = [
      { name: 'openai', method: this.generateWithOpenAI },
      { name: 'anthropic', method: this.generateWithAnthropic },
      { name: 'gemini', method: this.generateWithGemini }
    ]
    
    for (const provider of providers) {
      try {
        const result = await provider.method.call(this, query, context)
        if (result) return result
      } catch (error) {
        console.error(`${provider.name} error:`, error)
      }
    }
    
    // Fallback to enhanced mock data if all AI providers fail
    return this.generateEnhancedMockInsights(query, context)
  }
  
  private async generateWithOpenAI(query: string, context: any): Promise<MarketInsights | null> {
    if (!process.env.OPENAI_API_KEY) return null
    
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a market intelligence analyst. Analyze the topic "${query}" and provide comprehensive insights in JSON format with the following structure:
              {
                "opportunities": [4-6 specific market opportunities],
                "risks": [4-6 potential risks or challenges],
                "recommendations": [4-6 actionable recommendations],
                "futureOutlook": "A 2-3 sentence outlook for the next 3-5 years",
                "keyTakeaways": [3-4 key insights],
                "competitiveAnalysis": "Brief competitive landscape analysis",
                "marketSize": "Estimated market size and growth rate if applicable"
              }`
            },
            {
              role: 'user',
              content: `Provide market intelligence analysis for: ${query}. Context: ${JSON.stringify(context)}`
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return JSON.parse(response.data.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI API error:', error)
      return null
    }
  }
  
  private async generateWithAnthropic(query: string, context: any): Promise<MarketInsights | null> {
    if (!process.env.ANTHROPIC_API_KEY) return null
    
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `Analyze the market intelligence for "${query}" and provide insights in this exact JSON format:
              {
                "opportunities": [4-6 specific market opportunities as strings],
                "risks": [4-6 potential risks as strings],
                "recommendations": [4-6 actionable recommendations as strings],
                "futureOutlook": "A comprehensive 2-3 sentence outlook",
                "keyTakeaways": [3-4 key insights as strings],
                "competitiveAnalysis": "Brief competitive landscape analysis",
                "marketSize": "Market size and growth rate"
              }
              
              Context: ${JSON.stringify(context)}
              
              Respond only with valid JSON, no additional text.`
            }
          ]
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      )
      
      const content = response.data.content[0].text
      return JSON.parse(content)
    } catch (error) {
      console.error('Anthropic API error:', error)
      return null
    }
  }
  
  private async generateWithGemini(query: string, context: any): Promise<MarketInsights | null> {
    if (!process.env.GEMINI_API_KEY) return null
    
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the market for "${query}" and return ONLY a JSON object with this structure:
                  {
                    "opportunities": ["opportunity1", "opportunity2", "opportunity3", "opportunity4"],
                    "risks": ["risk1", "risk2", "risk3", "risk4"],
                    "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4"],
                    "futureOutlook": "2-3 sentence market outlook",
                    "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
                    "competitiveAnalysis": "competitive landscape analysis",
                    "marketSize": "market size and growth information"
                  }
                  Context: ${JSON.stringify(context)}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        }
      )
      
      const text = response.data.candidates[0].content.parts[0].text
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return null
    } catch (error) {
      console.error('Gemini API error:', error)
      return null
    }
  }
  
  private generateEnhancedMockInsights(query: string, context: any): MarketInsights {
    // Generate more intelligent mock data based on the query
    const queryLower = query.toLowerCase()
    const isTech = queryLower.includes('tech') || queryLower.includes('software') || queryLower.includes('ai')
    const isHealth = queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('pharma')
    const isFinance = queryLower.includes('finance') || queryLower.includes('banking') || queryLower.includes('crypto')
    
    let opportunities = [
      `Growing demand for ${query} solutions in emerging markets`,
      `Integration opportunities with AI and automation technologies`,
      `Potential for strategic partnerships and M&A activity`,
      `Expansion into adjacent market segments`
    ]
    
    let risks = [
      `Increasing competition from new market entrants`,
      `Regulatory compliance and evolving legal frameworks`,
      `Market saturation in developed regions`,
      `Technology disruption and rapid innovation cycles`
    ]
    
    if (isTech) {
      opportunities.push('Cloud migration and SaaS transformation opportunities')
      opportunities.push('Growing enterprise adoption and digital transformation')
      risks.push('Cybersecurity threats and data privacy concerns')
      risks.push('Talent acquisition and retention challenges')
    }
    
    if (isHealth) {
      opportunities.push('Telemedicine and remote healthcare expansion')
      opportunities.push('Personalized medicine and genomics integration')
      risks.push('Clinical trial complexities and FDA approval timelines')
      risks.push('Healthcare reimbursement and insurance coverage issues')
    }
    
    if (isFinance) {
      opportunities.push('DeFi and blockchain integration possibilities')
      opportunities.push('Open banking and API-driven innovation')
      risks.push('Regulatory scrutiny and compliance costs')
      risks.push('Market volatility and economic uncertainty')
    }
    
    return {
      opportunities: opportunities.slice(0, 6),
      risks: risks.slice(0, 6),
      recommendations: [
        `Invest in R&D to maintain competitive advantage in ${query}`,
        'Develop strategic partnerships to expand market reach',
        'Implement robust data analytics for market intelligence',
        'Focus on customer experience and retention strategies',
        'Build scalable infrastructure to support growth',
        'Establish thought leadership through content and research'
      ],
      futureOutlook: `The ${query} market is positioned for significant transformation over the next 3-5 years, driven by technological advancement, changing consumer behaviors, and regulatory evolution. Organizations that adapt quickly and invest strategically will capture disproportionate market share.`,
      keyTakeaways: [
        `${query} market shows strong growth potential with CAGR of 15-25%`,
        'Digital transformation is reshaping traditional business models',
        'Sustainability and ESG factors increasingly influence market dynamics',
        'Customer expectations for personalization and real-time service are rising'
      ],
      competitiveAnalysis: `The ${query} competitive landscape is becoming increasingly dynamic with both established players and innovative startups vying for market share. Key differentiators include technology capabilities, customer experience, and ecosystem partnerships.`,
      marketSize: 'Market valued at $XX billion in 2024, expected to reach $XX billion by 2029'
    }
  }
}
