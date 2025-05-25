import React from 'react'
import { ReportSection } from '@/types'

interface TwitterSectionProps {
  section: ReportSection
}

export default function TwitterSection({ section }: TwitterSectionProps) {
  const data = section.data as any
  
  if (!data || section.error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Twitter/X Analysis
        </h2>
        <p className="text-gray-600">
          {section.error || 'No Twitter data available. Configure Twitter API access to enable this feature.'}
        </p>
      </div>
    )
  }
  
  const { tweets, trending, sentiment, influencers } = data
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Twitter/X Analysis
      </h2>
      
      {/* Sentiment Overview */}
      {sentiment && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Overall Sentiment</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{sentiment.positive}%</div>
              <div className="text-sm text-green-700">Positive</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{sentiment.neutral}%</div>
              <div className="text-sm text-gray-700">Neutral</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{sentiment.negative}%</div>
              <div className="text-sm text-red-700">Negative</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${sentiment.positive}%` }}
              />
              <div 
                className="bg-gray-400 transition-all duration-500"
                style={{ width: `${sentiment.neutral}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${sentiment.negative}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Trending Topics */}
      {trending && trending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {trending.map((topic: string, index: number) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Top Influencers */}
      {influencers && influencers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Key Influencers</h3>
          <div className="space-y-3">
            {influencers.slice(0, 5).map((influencer: any, index: number) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <div className="font-medium text-gray-800">{influencer.name}</div>
                  <div className="text-sm text-gray-600">@{influencer.username}</div>
                </div>
                <div className="text-right">
                  {influencer.followers > 0 && (
                    <div className="text-sm text-gray-600">
                      {influencer.followers.toLocaleString()} followers
                    </div>
                  )}
                  <div className="text-sm font-medium text-blue-600">
                    {influencer.engagement.toLocaleString()} avg engagement
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Tweets */}
      {tweets && tweets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Recent Tweets</h3>
          <div className="space-y-4">
            {tweets.slice(0, 5).map((tweet: any, index: number) => (
              <div key={tweet.id || index} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-800">{tweet.author.name}</span>
                    <span className="text-gray-600 text-sm ml-2">@{tweet.author.username}</span>
                    {tweet.author.verified && (
                      <span className="ml-1 text-blue-500 text-sm">✓</span>
                    )}
                  </div>
                  <a 
                    href={tweet.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    View
                  </a>
                </div>
                <p className="text-gray-700 mb-2">{tweet.text}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>❤️ {tweet.metrics.likes.toLocaleString()}</span>
                  <span>🔁 {tweet.metrics.retweets.toLocaleString()}</span>
                  <span>💬 {tweet.metrics.replies.toLocaleString()}</span>
                  {tweet.metrics.views && (
                    <span>👁️ {tweet.metrics.views.toLocaleString()}</span>
                  )}
                  <span className="ml-auto">
                    {new Date(tweet.created_at).toLocaleDateString()}
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