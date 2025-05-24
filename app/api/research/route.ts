import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Crossref API for academic papers
    const crossrefResponse = await axios.get('https://api.crossref.org/works', {
      params: {
        query: query,
        rows: 5,
        select: 'DOI,title,author,published-print,abstract'
      }
    })
    
    const papers = crossrefResponse.data.message?.items?.map(item => ({
      title: item.title?.[0] || 'Untitled',
      authors: item.author?.map(a => `${a.given} ${a.family}`).slice(0, 3) || ['Unknown'],
      abstract: item.abstract || 'No abstract available',
      year: item['published-print']?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      doi: item.DOI,
      url: `https://doi.org/${item.DOI}`
    })) || []
    
    return NextResponse.json({ papers })
  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research data' },
      { status: 500 }
    )
  }
}