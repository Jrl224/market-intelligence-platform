'use client'

import { QueryExpansion } from '@/app/api/ai/query-expansion/route'

interface QueryExpansionSectionProps {
  data: QueryExpansion
}

export default function QueryExpansionSection({ data }: QueryExpansionSectionProps) {
  if (!data) return null

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Market Intelligence Context
        </h3>
        <p className="text-sm opacity-90">
          AI-powered query expansion identified the following category and competitive landscape for "{data.originalQuery}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Identification */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Category Identification
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">{data.category.name}</span>
              <span className="text-sm text-gray-500">
                {Math.round(data.category.confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-sm text-gray-600">{data.category.description}</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Product Types
            </div>
            <div className="flex flex-wrap gap-1">
              {data.productTypes.map((type, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Competitive Landscape */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Competitive Landscape
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 mb-1">Direct Competitors</div>
              <div className="flex flex-wrap gap-1">
                {data.competitors.map((competitor, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                  >
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Related Brands</div>
              <div className="flex flex-wrap gap-1">
                {data.relatedBrands.slice(0, 4).map((brand, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Context */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Industry Context
        </h4>
        <p className="text-sm text-gray-700">{data.industryContext}</p>
      </div>

      {/* Search Strategy */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Enhanced Search Strategy
        </h4>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="text-xs font-medium text-gray-500 w-20">Primary:</span>
            <div className="flex-1 flex flex-wrap gap-1">
              {data.searchStrategy.primary.map((term, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-xs font-medium text-gray-500 w-20">Category:</span>
            <div className="flex-1 flex flex-wrap gap-1">
              {data.searchStrategy.secondary.map((term, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-xs font-medium text-gray-500 w-20">Context:</span>
            <div className="flex-1 flex flex-wrap gap-1">
              {data.searchStrategy.contextual.map((term, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center pt-2">
        Using expanded search terms to provide comprehensive market intelligence across all data sources
      </div>
    </div>
  )
}
