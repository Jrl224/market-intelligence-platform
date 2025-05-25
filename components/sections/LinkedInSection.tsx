import React from 'react'
import { ReportSection } from '@/types'

interface LinkedInSectionProps {
  section: ReportSection
}

export default function LinkedInSection({ section }: LinkedInSectionProps) {
  const data = section.data as any
  
  if (!data || section.error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          LinkedIn Professional Insights
        </h2>
        <p className="text-gray-600">
          {section.error || 'No LinkedIn data available. Configure LinkedIn API access to enable this feature.'}
        </p>
      </div>
    )
  }
  
  const { posts, companies, insights, sentiment } = data
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        LinkedIn Professional Insights
      </h2>
      
      {/* Professional Sentiment */}
      {sentiment && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Professional Sentiment</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{sentiment.positive}%</div>
              <div className="text-sm text-blue-700">Positive</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{sentiment.neutral}%</div>
              <div className="text-sm text-gray-700">Neutral</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{sentiment.negative}%</div>
              <div className="text-sm text-orange-700">Negative</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-blue-500 transition-all duration-500"
                style={{ width: `${sentiment.positive}%` }}
              />
              <div 
                className="bg-gray-400 transition-all duration-500"
                style={{ width: `${sentiment.neutral}%` }}
              />
              <div 
                className="bg-orange-500 transition-all duration-500"
                style={{ width: `${sentiment.negative}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Industry Insights */}
      {insights && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Industry Insights</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Industry Trends */}
            {insights.industryTrends && insights.industryTrends.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Industry Trends</h4>
                <ul className="space-y-1">
                  {insights.industryTrends.slice(0, 5).map((trend: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Skills in Demand */}
            {insights.skillsInDemand && insights.skillsInDemand.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Skills in Demand</h4>
                <div className="flex flex-wrap gap-1">
                  {insights.skillsInDemand.slice(0, 6).map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hiring Trends */}
            {insights.hiringTrends && insights.hiringTrends.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Hiring Trends</h4>
                <ul className="space-y-1">
                  {insights.hiringTrends.slice(0, 5).map((trend: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Key Companies */}
      {companies && companies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Key Companies</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {companies.slice(0, 4).map((company: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {company.followers?.toLocaleString()} followers
                    </div>
                    <div className="text-xs text-gray-600">{company.size}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{company.description}</p>
                {company.specialties && company.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {company.specialties.slice(0, 4).map((specialty: string, idx: number) => (
                      <span 
                        key={idx}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Posts */}
      {posts && posts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Trending Professional Posts</h3>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post: any, index: number) => (
              <div key={post.id || index} className="border-l-4 border-blue-600 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-800">{post.author.name}</span>
                    <p className="text-sm text-gray-600">{post.author.headline}</p>
                    {post.author.company && (
                      <p className="text-xs text-gray-600">at {post.author.company}</p>
                    )}
                  </div>
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on LinkedIn
                  </a>
                </div>
                <p className="text-gray-700 mb-2">{post.text}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>👍 {post.engagement.likes.toLocaleString()}</span>
                  <span>💬 {post.engagement.comments.toLocaleString()}</span>
                  <span>🔄 {post.engagement.shares.toLocaleString()}</span>
                  <span className="ml-auto">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}