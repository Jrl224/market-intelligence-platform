import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Mock AI-generated summary
    const summary = `This comprehensive analysis of "${query}" reveals significant market dynamics and emerging trends. 
    The data indicates growing interest across multiple sectors, with particular emphasis on innovation and sustainability. 
    Key stakeholders are actively investing in research and development, while regulatory frameworks continue to evolve. 
    Market indicators suggest a positive outlook with opportunities for strategic positioning.`
    
    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summary API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}