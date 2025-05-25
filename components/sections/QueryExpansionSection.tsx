'use client'

import { QueryExpansion } from '@/app/api/ai/query-expansion/route'
import { Search, Tag, TrendingUp, Building2, Package, Sparkles } from 'lucide-react'

interface QueryExpansionSectionProps {
  data: QueryExpansion
}

export default function QueryExpansionSection({ data }: QueryExpansionSectionProps) {
  if (!data) return null

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
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
            <Tag className="w-4 h-4 mr-2 text-blue-600" />
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
              <Package className="w-3 h-3 mr-1" />
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
            <Building2 className="w-4 h-4 mr-2 text-purple-600" />
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
          <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
          Industry Context
        </h4>
        <p className="text-sm text-gray-700">{data.industryContext}</p>
      </div>

      {/* Search Strategy */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Search className="w-4 h-4 mr-2 text-green-600" />
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
