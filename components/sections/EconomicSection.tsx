'use client'

import { EconomicData } from '@/types'

interface EconomicSectionProps {
  data: EconomicData
}

export default function EconomicSection({ data }: EconomicSectionProps) {
  if (!data.indicators || data.indicators.length === 0) {
    return <p className="text-gray-600">No economic indicators available.</p>
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.indicators.map((indicator, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">{indicator.name}</h4>
          <p className="text-2xl font-bold text-gray-800">
            {indicator.value.toLocaleString()} {indicator.unit}
          </p>
          <p className={`text-sm mt-1 ${
            indicator.change > 0 ? 'text-green-600' : 
            indicator.change < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {indicator.change > 0 ? '↑' : indicator.change < 0 ? '↓' : '→'} {Math.abs(indicator.change)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(indicator.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}