'use client'

import { ReportSection as ReportSectionType } from '@/types'
import TrendsSection from './sections/TrendsSection'
import NewsSection from './sections/NewsSection'
import SentimentSection from './sections/SentimentSection'
import ResearchSection from './sections/ResearchSection'
import PatentsSection from './sections/PatentsSection'
import EconomicSection from './sections/EconomicSection'
import InsightsSection from './sections/InsightsSection'
import FinancialSection from './sections/FinancialSection'

interface ReportSectionProps {
  section: ReportSectionType
}

export default function ReportSection({ section }: ReportSectionProps) {
  if (!section.visible) return null
  
  const renderSection = () => {
    switch (section.type) {
      case 'trends':
        return <TrendsSection data={section.data} />
      case 'news':
        return <NewsSection data={section.data} />
      case 'sentiment':
        return <SentimentSection data={section.data} />
      case 'research':
        return <ResearchSection data={section.data} />
      case 'patents':
        return <PatentsSection data={section.data} />
      case 'economic':
        return <EconomicSection data={section.data} />
      case 'insights':
        return <InsightsSection data={section.data} />
      case 'financial':
        return <FinancialSection data={section.data} />
      default:
        return null
    }
  }
  
  return (
    <div className="report-section">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.title}</h2>
      {renderSection()}
    </div>
  )
}