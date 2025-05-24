'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import Report from '@/components/Report'
import LoadingState from '@/components/LoadingState'
import { generateReport } from '@/lib/reportGenerator'
import type { ReportData } from '@/types'

const EXAMPLE_SEARCHES = [
  { query: 'sustainable packaging trends', category: 'Trends' },
  { query: 'Tesla TSLA stock analysis', category: 'Company' },
  { query: 'AI in healthcare 2024', category: 'Industry' },
  { query: 'cryptocurrency regulation', category: 'Market' },
  { query: 'renewable energy market', category: 'Sector' },
  { query: 'Apple iPhone market share', category: 'Product' }
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setQuery(searchQuery)
    setLoading(true)
    setError(null)
    setReport(null)
    
    try {
      const data = await generateReport(searchQuery)
      setReport(data)
    } catch (err) {
      setError('Failed to generate report. Please try again.')
      console.error('Report generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!loading && !report && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
              Market Intelligence Platform
            </h1>
            <p className="text-center text-gray-600 mb-8">
              AI-powered insights for any topic, product, or industry
            </p>
            <SearchBar onSearch={handleSearch} />
            
            {/* Example searches */}
            <div className="mt-12">
              <p className="text-center text-gray-500 text-sm mb-4">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_SEARCHES.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(example.query)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover-card"
                  >
                    <span className="text-gray-500">{example.category}:</span>{' '}
                    <span className="font-medium">{example.query}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-gray-600">Real-time Data</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-sm text-gray-600">AI Analysis</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm text-gray-600">PDF Export</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🌐</div>
                <p className="text-sm text-gray-600">15+ Data Sources</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-gray-500">
            <p>
              Built by{' '}
              <a 
                href="https://github.com/Jrl224" 
                className="text-blue-500 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jrl224
              </a>
              {' '}•{' '}
              <a 
                href="https://github.com/Jrl224/market-intelligence-platform" 
                className="text-blue-500 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              {' '}•{' '}
              <a 
                href="https://github.com/Jrl224/market-intelligence-platform#api-key-resources" 
                className="text-blue-500 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Setup Guide
              </a>
            </p>
          </div>
        </div>
      )}
      
      {loading && <LoadingState query={query} />}
      
      {report && !loading && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
          <Report data={report} query={query} />
          
          {/* Footer for report view */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Generated by Market Intelligence Platform •{' '}
              <a 
                href="https://github.com/Jrl224/market-intelligence-platform" 
                className="text-blue-500 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold mb-2">Error generating report</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              This could be due to API limits or configuration issues. 
              Check the API status using the settings icon in the search bar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
