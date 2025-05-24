'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import Report from '@/components/Report'
import LoadingState from '@/components/LoadingState'
import { generateReport } from '@/lib/reportGenerator'
import type { ReportData } from '@/types'

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
        </div>
      )}
      
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      )}
    </div>
  )
}