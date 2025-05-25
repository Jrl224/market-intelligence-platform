import React from 'react'
import { ReportSection } from '@/types'

interface CompetitorSectionProps {
  section: ReportSection
}

export default function CompetitorSection({ section }: CompetitorSectionProps) {
  const data = section.data as any
  
  if (!data || section.error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Competitor Analysis
        </h2>
        <p className="text-gray-600">
          {section.error || 'No competitor data available.'}
        </p>
      </div>
    )
  }
  
  const { competitors, marketOverview, competitivePositioning, recommendations } = data
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Competitor Analysis
      </h2>
      
      {/* Market Overview */}
      {marketOverview && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Market Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Market Size</div>
              <div className="text-xl font-bold text-gray-800">{marketOverview.totalMarketSize}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Growth Rate</div>
              <div className="text-xl font-bold text-green-600">{marketOverview.growthRate}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Key Players</div>
              <div className="text-xl font-bold text-gray-800">{marketOverview.marketLeaders?.length || 0}</div>
            </div>
          </div>
          
          {/* Market Share Chart */}
          {marketOverview.marketLeaders && marketOverview.marketLeaders.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Market Share Distribution</h4>
              <div className="w-full bg-gray-200 rounded-full h-8 flex overflow-hidden">
                {marketOverview.marketLeaders.map((leader: any, index: number) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-400']
                  return (
                    <div
                      key={index}
                      className={`${colors[index % colors.length]} transition-all duration-500 flex items-center justify-center text-white text-xs font-medium`}
                      style={{ width: `${leader.share}%` }}
                      title={`${leader.name}: ${leader.share}%`}
                    >
                      {leader.share > 5 && `${leader.share}%`}
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketOverview.marketLeaders.map((leader: any, index: number) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-400']
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded ${colors[index % colors.length]}`}></div>
                      <span className="text-xs text-gray-600">{leader.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Key Trends */}
          {marketOverview.keyTrends && marketOverview.keyTrends.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Market Trends</h4>
              <ul className="space-y-1">
                {marketOverview.keyTrends.map((trend: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span className="text-sm text-gray-600">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Competitors */}
      {competitors && competitors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Key Competitors</h3>
          <div className="space-y-4">
            {competitors.map((competitor: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{competitor.name}</h4>
                    <p className="text-sm text-gray-600">{competitor.description}</p>
                    {competitor.domain && (
                      <a href={`https://${competitor.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                        {competitor.domain}
                      </a>
                    )}
                  </div>
                  {competitor.marketShare && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{competitor.marketShare}%</div>
                      <div className="text-xs text-gray-600">Market Share</div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  {competitor.founded && (
                    <div>
                      <span className="text-gray-600">Founded:</span>
                      <span className="ml-1 font-medium">{competitor.founded}</span>
                    </div>
                  )}
                  {competitor.employees && (
                    <div>
                      <span className="text-gray-600">Employees:</span>
                      <span className="ml-1 font-medium">{competitor.employees}</span>
                    </div>
                  )}
                  {competitor.revenue && (
                    <div>
                      <span className="text-gray-600">Revenue:</span>
                      <span className="ml-1 font-medium">{competitor.revenue}</span>
                    </div>
                  )}
                  {competitor.headquarters && (
                    <div>
                      <span className="text-gray-600">HQ:</span>
                      <span className="ml-1 font-medium">{competitor.headquarters}</span>
                    </div>
                  )}
                </div>
                
                {/* Products */}
                {competitor.products && competitor.products.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Key Products: </span>
                    <span className="text-sm font-medium">{competitor.products.join(', ')}</span>
                  </div>
                )}
                
                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  {competitor.strengths && competitor.strengths.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-1">Strengths</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {competitor.strengths.slice(0, 3).map((strength: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-red-700 mb-1">Weaknesses</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {competitor.weaknesses.slice(0, 3).map((weakness: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-red-500">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Recent News */}
                {competitor.recentNews && competitor.recentNews.length > 0 && (
                  <div className="border-t pt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent News</h5>
                    {competitor.recentNews.slice(0, 2).map((news: any, idx: number) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm font-medium text-gray-800">{news.title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(news.date).toLocaleDateString()} - {news.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* SWOT Analysis */}
      {competitivePositioning && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Competitive Positioning (SWOT)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {competitivePositioning.strengths?.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Weaknesses */}
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {competitivePositioning.weaknesses?.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Opportunities */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Opportunities</h4>
              <ul className="space-y-1">
                {competitivePositioning.opportunities?.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Threats */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Threats</h4>
              <ul className="space-y-1">
                {competitivePositioning.threats?.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Strategic Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Strategic Recommendations</h3>
          <div className="space-y-2">
            {recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}