'use client'

import { NewsData } from '@/types'

interface NewsSectionProps {
  data: NewsData
}

export default function NewsSection({ data }: NewsSectionProps) {
  if (!data.articles || data.articles.length === 0) {
    return <p className="text-gray-600">No recent news articles found.</p>
  }
  
  return (
    <div className="space-y-4">
      {data.articles.slice(0, 6).map((article, index) => (
        <article key={index} className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {article.title}
            </a>
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 line-clamp-2">{article.description}</p>
        </article>
      ))}
    </div>
  )
}