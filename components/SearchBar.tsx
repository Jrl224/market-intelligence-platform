'use client'

import { useState } from 'react'
import ApiStatus from './ApiStatus'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [showApiStatus, setShowApiStatus] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }
  
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any topic, product, company, or industry..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowApiStatus(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="API Status"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors btn-primary"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      
      <ApiStatus isOpen={showApiStatus} onClose={() => setShowApiStatus(false)} />
    </>
  )
}
