'use client'

import { ResearchData } from '@/types'

interface ResearchSectionProps {
  data: ResearchData
}

export default function ResearchSection({ data }: ResearchSectionProps) {
  if (!data.papers || data.papers.length === 0) {
    return <p className="text-gray-600">No academic research found.</p>
  }
  
  return (
    <div className="space-y-4">
      {data.papers.slice(0, 5).map((paper, index) => (
        <article key={index} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {paper.url ? (
              <a 
                href={paper.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {paper.title}
              </a>
            ) : paper.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {paper.authors.join(', ')} • {paper.year}
          </p>
          <p className="text-gray-700 text-sm line-clamp-3">{paper.abstract}</p>
          {paper.doi && (
            <p className="text-xs text-gray-500 mt-2">DOI: {paper.doi}</p>
          )}
        </article>
      ))}
    </div>
  )
}