'use client'

import { useEffect, useState } from 'react'

interface ApiConfig {
  name: string
  key: string
  category: string
  required?: boolean
  description: string
}

const API_CONFIGS: ApiConfig[] = [
  { name: 'SerpAPI', key: 'SERPAPI_KEY', category: 'Search & Trends', required: true, description: 'Google Trends data' },
  { name: 'NewsAPI', key: 'NEWSAPI_KEY', category: 'News', required: true, description: 'Latest news articles' },
  { name: 'Reddit', key: 'REDDIT_CLIENT_ID', category: 'Social', description: 'Community discussions' },
  { name: 'YouTube', key: 'YOUTUBE_API_KEY', category: 'Social', description: 'Video comments' },
  { name: 'OpenAI', key: 'OPENAI_API_KEY', category: 'AI', description: 'GPT-4 insights' },
  { name: 'Anthropic', key: 'ANTHROPIC_API_KEY', category: 'AI', description: 'Claude analysis' },
  { name: 'Gemini', key: 'GEMINI_API_KEY', category: 'AI', description: 'Google AI' },
  { name: 'FRED', key: 'FRED_API_KEY', category: 'Economic', description: 'Economic indicators' },
  { name: 'Alpha Vantage', key: 'ALPHA_VANTAGE_KEY', category: 'Financial', description: 'Stock market data' },
  { name: 'Semantic Scholar', key: 'SEMANTIC_SCHOLAR_KEY', category: 'Research', description: 'Academic papers' }
]

export default function ApiStatus({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiStatuses, setApiStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Fetch actual API status from the server
      fetch('/api/config/status')
        .then(res => res.json())
        .then(data => {
          setApiStatuses(data.status)
          setStats(data.stats)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const categorizedApis = API_CONFIGS.reduce((acc, api) => {
    if (!acc[api.category]) acc[api.category] = []
    acc[api.category].push(api)
    return acc
  }, {} as Record<string, ApiConfig[]>)
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">API Configuration Status</h2>
            {stats && (
              <p className="text-sm text-gray-600 mt-1">
                {stats.configured} of {stats.total} APIs configured ({stats.percentage}%)
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner" />
            </div>
          ) : (
            <>
              {stats && !stats.hasMinimumRequired && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Missing required APIs:</span> For basic functionality, 
                    you need at least SerpAPI, NewsAPI, and one AI provider (OpenAI, Anthropic, or Gemini).
                  </p>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                The platform adapts to available APIs. Missing APIs only disable their specific features.
              </p>
              
              {Object.entries(categorizedApis).map(([category, apis]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {apis.map(api => (
                      <div 
                        key={api.key}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          apiStatuses[api.key] 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            apiStatuses[api.key] ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-800">
                              {api.name}
                              {api.required && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <p className="text-sm text-gray-600">{api.description}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          {apiStatuses[api.key] ? (
                            <span className="text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-gray-500">Not configured</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Configuration:</span> Add your API keys to the{' '}
                  <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> file or 
                  in your deployment environment variables.
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  <span className="font-semibold">Need help?</span> Check the{' '}
                  <a href="https://github.com/Jrl224/market-intelligence-platform" 
                     className="underline hover:text-blue-900" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    README
                  </a>{' '}
                  for detailed setup instructions.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
