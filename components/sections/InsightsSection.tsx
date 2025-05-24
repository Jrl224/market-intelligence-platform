'use client'

import { InsightsData } from '@/types'

interface InsightsSectionProps {
  data: InsightsData
}

export default function InsightsSection({ data }: InsightsSectionProps) {
  return (
    <div className="space-y-6">
      {data.opportunities && data.opportunities.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-green-700 mb-3">Opportunities</h3>
          <ul className="space-y-2">
            {data.opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mt-1 mr-2">•</span>
                <span className="text-gray-700">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {data.risks && data.risks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-red-700 mb-3">Risks & Challenges</h3>
          <ul className="space-y-2">
            {data.risks.map((risk, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mt-1 mr-2">•</span>
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {data.recommendations && data.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-blue-700 mb-3">Recommendations</h3>
          <ul className="space-y-2">{data.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mt-1 mr-2">•</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}</ul>
        </div>
      )}
      
      {data.futureOutlook && (
        <div>
          <h3 className="text-lg font-medium text-purple-700 mb-3">Future Outlook</h3>
          <p className="text-gray-700 leading-relaxed">{data.futureOutlook}</p>
        </div>
      )}
    </div>
  )
}