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
  content?: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    const articles: any[] = []
    const sources: string[] = []
    
    // Try NewsAPI first
    if (process.env.NEWSAPI_KEY) {
      try {
        const newsApiResponse = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: query,
            apiKey: process.env.NEWSAPI_KEY,
            sortBy: 'relevancy',
            language: 'en',
            pageSize: 20,
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 30 days
          },
          timeout: 10000
        })
        
        if (newsApiResponse.data.articles) {
          newsApiResponse.data.articles.forEach((article: NewsArticle) => {
            articles.push({
              title: article.title,
              description: article.description || article.content?.substring(0, 200) || '',
              url: article.url,
              source: article.source.name,
              publishedAt: article.publishedAt,
              imageUrl: article.urlToImage
            })
          })
          sources.push('NewsAPI')
        }
      } catch (error: any) {
        console.error('NewsAPI error:', error.response?.data || error.message)
      }
    }
    
    // Try Google News via SerpAPI as backup
    if (process.env.SERPAPI_KEY && articles.length < 10) {
      try {
        const serpApiResponse = await axios.get('https://serpapi.com/search', {
          params: {
            engine: 'google_news',
            q: query,
            api_key: process.env.SERPAPI_KEY
          },
          timeout: 10000
        })
        
        if (serpApiResponse.data.news_results) {
          serpApiResponse.data.news_results.forEach((article: any) => {
            articles.push({
              title: article.title || '',
              description: article.snippet || '',
              url: article.link || '',
              source: article.source?.name || 'Unknown',
              publishedAt: article.date || new Date().toISOString(),
              imageUrl: article.thumbnail || null
            })
          })
          sources.push('Google News')
        }
      } catch (error) {
        console.error('SerpAPI Google News error:', error)
      }
    }
    
    // Try Bing News Search as another backup
    if (process.env.BING_NEWS_KEY && articles.length < 10) {
      try {
        const bingResponse = await axios.get(
          'https://api.bing.microsoft.com/v7.0/news/search',
          {
            params: {
              q: query,
              count: 20,
              freshness: 'Month',
              mkt: 'en-US'
            },
            headers: {
              'Ocp-Apim-Subscription-Key': process.env.BING_NEWS_KEY
            },
            timeout: 10000
          }
        )
        
        if (bingResponse.data.value) {
          bingResponse.data.value.forEach((article: any) => {
            articles.push({
              title: article.name,
              description: article.description,
              url: article.url,
              source: article.provider?.[0]?.name || 'Unknown',
              publishedAt: article.datePublished,
              imageUrl: article.image?.thumbnail?.contentUrl || null
            })
          })
          sources.push('Bing News')
        }
      } catch (error) {
        console.error('Bing News error:', error)
      }
    }
    
    // Remove duplicates based on URL
    const uniqueArticles = articles.reduce((acc: any[], article) => {
      if (!acc.find(a => a.url === article.url)) {
        acc.push(article)
      }
      return acc
    }, [])
    
    // Sort by date (newest first)
    uniqueArticles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    
    // If still no articles, return a message
    if (uniqueArticles.length === 0) {
      return NextResponse.json({
        articles: [],
        message: 'No recent news articles found. This could be due to API limits or no recent coverage.',
        sources: sources
      })
    }
    
    return NextResponse.json({
      articles: uniqueArticles.slice(0, 15),
      sources: sources
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({
      articles: [],
      message: 'Unable to fetch news at this time',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
