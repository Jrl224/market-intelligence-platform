import axios from 'axios'

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

export class AcademicClient {
  // Semantic Scholar API
  async searchSemanticScholar(query: string, limit: number = 10): Promise<Paper[]> {
    try {
      const response = await axios.get(
        'https://api.semanticscholar.org/graph/v1/paper/search',
        {
          params: {
            query: query,
            limit: limit,
            fields: 'title,authors,abstract,year,citationCount,externalIds,url'
          },
          headers: {
            'x-api-key': process.env.SEMANTIC_SCHOLAR_KEY || ''
          }
        }
      )

      return response.data.data.map((paper: any) => ({
        title: paper.title,
        authors: paper.authors?.map((a: any) => a.name) || [],
        abstract: paper.abstract || 'No abstract available',
        year: paper.year || new Date().getFullYear(),
        doi: paper.externalIds?.DOI,
        url: paper.url || (paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : ''),
        citations: paper.citationCount,
        source: 'Semantic Scholar'
      }))
    } catch (error) {
      console.error('Semantic Scholar error:', error)
      return []
    }
  }

  // arXiv API
  async searchArxiv(query: string, limit: number = 10): Promise<Paper[]> {
    try {
      const response = await axios.get(
        'http://export.arxiv.org/api/query',
        {
          params: {
            search_query: `all:${query}`,
            max_results: limit,
            sortBy: 'relevance'
          }
        }
      )

      // Parse XML response
      const papers: Paper[] = []
      const entries = response.data.match(/<entry>([\s\S]*?)<\/entry>/g) || []
      
      entries.forEach((entry: string) => {
        const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || ''
        const abstract = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || ''
        const authors = (entry.match(/<author>\s*<name>([^<]+)<\/name>\s*<\/author>/g) || [])
          .map(a => a.match(/<name>([^<]+)<\/name>/)?.[1] || '')
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || ''
        const year = published ? new Date(published).getFullYear() : new Date().getFullYear()
        const id = entry.match(/<id>([^<]+)<\/id>/)?.[1] || ''
        const arxivId = id.split('/').pop() || ''
        
        papers.push({
          title,
          authors,
          abstract,
          year,
          url: id,
          source: 'arXiv'
        })
      })

      return papers
    } catch (error) {
      console.error('arXiv error:', error)
      return []
    }
  }

  // PubMed API
  async searchPubMed(query: string, limit: number = 10): Promise<Paper[]> {
    try {
      // First, search for IDs
      const searchResponse = await axios.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
        {
          params: {
            db: 'pubmed',
            term: query,
            retmax: limit,
            retmode: 'json'
          }
        }
      )

      const ids = searchResponse.data.esearchresult?.idlist || []
      if (ids.length === 0) return []

      // Fetch details for the IDs
      const detailsResponse = await axios.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
        {
          params: {
            db: 'pubmed',
            id: ids.join(','),
            retmode: 'json'
          }
        }
      )

      const papers: Paper[] = []
      const results = detailsResponse.data.result
      
      ids.forEach((id: string) => {
        const paper = results[id]
        if (!paper) return
        
        papers.push({
          title: paper.title || '',
          authors: paper.authors?.map((a: any) => a.name) || [],
          abstract: 'View on PubMed for abstract',
          year: parseInt(paper.pubdate?.split(' ')[0]) || new Date().getFullYear(),
          doi: paper.elocationid?.replace('doi: ', ''),
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          source: 'PubMed'
        })
      })

      return papers
    } catch (error) {
      console.error('PubMed error:', error)
      return []
    }
  }

  // CORE API (Open Access papers)
  async searchCore(query: string, limit: number = 10): Promise<Paper[]> {
    try {
      const response = await axios.post(
        'https://api.core.ac.uk/v3/search/works',
        {
          q: query,
          limit: limit
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CORE_API_KEY || ''}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.results.map((paper: any) => ({
        title: paper.title || '',
        authors: paper.authors?.map((a: any) => a.name) || [],
        abstract: paper.abstract || 'No abstract available',
        year: paper.yearPublished || new Date().getFullYear(),
        doi: paper.doi,
        url: paper.downloadUrl || paper.links?.[0] || '',
        source: 'CORE'
      }))
    } catch (error) {
      console.error('CORE error:', error)
      return []
    }
  }

  // Combine results from all sources
  async searchAll(query: string, limit: number = 20): Promise<Paper[]> {
    const promises = [
      this.searchSemanticScholar(query, Math.floor(limit / 4)),
      this.searchArxiv(query, Math.floor(limit / 4)),
      this.searchPubMed(query, Math.floor(limit / 4)),
      this.searchCore(query, Math.floor(limit / 4))
    ]

    const results = await Promise.allSettled(promises)
    
    const allPapers = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => (result as any).value)
    
    // Remove duplicates based on title similarity
    const uniquePapers: Paper[] = []
    const seenTitles = new Set<string>()
    
    allPapers.forEach(paper => {
      const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!seenTitles.has(normalizedTitle) && normalizedTitle.length > 10) {
        seenTitles.add(normalizedTitle)
        uniquePapers.push(paper)
      }
    })
    
    // Sort by citations if available, otherwise by year
    return uniquePapers
      .sort((a, b) => {
        if (a.citations && b.citations) return b.citations - a.citations
        return b.year - a.year
      })
      .slice(0, limit)
  }
}
