'use client'

import { ReportData } from '@/types'
import ReportSection from './ReportSection'
import ExportButton from './ExportButton'

interface ReportProps {
  data: ReportData
  query: string
}

export default function Report({ data, query }: ReportProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{query}</h1>
          <ExportButton data={data} />
        </div>
        <p className="text-gray-600 mb-2">
          Generated on {new Date(data.timestamp).toLocaleString()}
        </p>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700">{data.summary}</p>
        </div>
      </div>
      
      {data.sections.map((section) => (
        <ReportSection key={section.id} section={section} />
      ))}
    </div>
  )
}