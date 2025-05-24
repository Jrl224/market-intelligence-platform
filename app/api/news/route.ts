import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface NewsArticle {
  title: string
  description: string
  url: string
  source: {
    name: string
  }
  publishedAt: string
  urlToImage: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!process.env.NEWSAPI_KEY) {
      throw new Error('NEWSAPI_KEY is not configured')
    }
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: process.env.NEWSAPI_KEY,
        sortBy: 'relevancy',
        language: 'en',
        pageSize: 10
      }
    })
    
    const articles = response.data.articles?.map((article: NewsArticle) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage
    })) || []
    
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    )
  }
}