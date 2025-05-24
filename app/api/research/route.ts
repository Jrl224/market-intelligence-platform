import { NextRequest, NextResponse } from 'next/server'
import { AcademicClient } from '@/lib/api/clients/academic-client'
import axios from 'axios'

interface CrossrefAuthor {
  given: string
  family: string
}

interface CrossrefItem {
  title?: string[]
  author?: CrossrefAuthor[]
  abstract?: string
  'published-print'?: {
    'date-parts'?: number[][]
  }
  DOI: string
  'is-referenced-by-count'?: number
}

interface Paper {
  title: string
  authors: string[]
  abstract: string
  year: number
  doi?: string
  url: string
  citations?: number
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Initialize academic client
    const academicClient = new AcademicClient()
    
    // Search across multiple academic sources
    const papers = await academicClient.searchAll(query, 20)
    
    // Also try Crossref for additional results
    let crossrefPapers: Paper[] = []
    try {
      const crossrefResponse = await axios.get('https://api.crossref.org/works', {
        params: {
          query: query,
          rows: 10,
          select: 'DOI,title,author,published-print,abstract,is-referenced-by-count',
          mailto: process.env.CROSSREF_EMAIL || 'support@marketintelligence.com'
        }
      })
      
      crossrefPapers = crossrefResponse.data.message?.items?.map((item: CrossrefItem) => ({
        title: item.title?.[0] || 'Untitled',
        authors: item.author?.map((a: CrossrefAuthor) => `${a.given} ${a.family}`).slice(0, 3) || ['Unknown'],
        abstract: item.abstract || 'No abstract available',
        year: item['published-print']?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
        doi: item.DOI,
        url: `https://doi.org/${item.DOI}`,
        citations: item['is-referenced-by-count'],
        source: 'Crossref'
      })) || []
    } catch (error) {
      console.error('Crossref error:', error)
    }
    
    // Combine and deduplicate papers
    const allPapers = [...papers, ...crossrefPapers]
    const uniquePapers: Paper[] = []
    const seenDOIs = new Set<string>()
    const seenTitles = new Set<string>()
    
    allPapers.forEach(paper => {
      const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (paper.doi && !seenDOIs.has(paper.doi)) {
        seenDOIs.add(paper.doi)
        uniquePapers.push(paper)
      } else if (!seenTitles.has(normalizedTitle) && normalizedTitle.length > 10) {
        seenTitles.add(normalizedTitle)
        uniquePapers.push(paper)
      }
    })
    
    // Sort by relevance (citations, then year)
    const sortedPapers = uniquePapers
      .sort((a, b) => {
        if (a.citations && b.citations) return b.citations - a.citations
        return b.year - a.year
      })
      .slice(0, 15)
    
    return NextResponse.json({ papers: sortedPapers })
  } catch (error) {
    console.error('Research API error:', error)
    
    // Return empty data instead of error
    return NextResponse.json({ papers: [] })
  }
}
