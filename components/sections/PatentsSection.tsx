'use client'

import { PatentData } from '@/types'

interface PatentsSectionProps {
  data: PatentData
}

export default function PatentsSection({ data }: PatentsSectionProps) {
  if (!data.patents || data.patents.length === 0) {
    return <p className="text-gray-600">No patent activity found.</p>
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-800">
          Total Patents Found: <span className="font-semibold">{data.totalCount}</span>
        </p>
      </div>
      
      {data.patents.slice(0, 5).map((patent, index) => (
        <div key={index} className="border-l-4 border-green-500 pl-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{patent.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Patent #{patent.patentNumber} • {patent.date}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Inventor:</span> {patent.inventor}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Assignee:</span> {patent.assignee}
          </p>
          <p className="text-gray-700 text-sm line-clamp-2">{patent.abstract}</p>
        </div>
      ))}
    </div>
  )
}