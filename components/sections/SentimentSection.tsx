'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { SentimentData } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface SentimentSectionProps {
  data: SentimentData
}

export default function SentimentSection({ data }: SentimentSectionProps) {
  // Use overall sentiment if available, otherwise fall back to YouTube or Reddit sentiment
  const sentiment = data.overallSentiment || data.youtubeSentiment || data.redditSentiment || {
    positive: 0,
    neutral: 0,
    negative: 0
  }
  
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          sentiment.positive,
          sentiment.neutral,
          sentiment.negative
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }
  
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '%'
          }
        }
      }
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Overall Sentiment</h3>
          <div className="w-64 mx-auto">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          
          {/* Show sentiment sources if available */}
          {(data.redditSentiment || data.youtubeSentiment) && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Based on analysis of:</p>
              {data.redditSentiment && <p>• Reddit discussions</p>}
              {data.youtubeSentiment && <p>• YouTube comments</p>}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Recent Community Discussions</h3>
          {data.redditPosts && data.redditPosts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.redditPosts.slice(0, 5).map((post, index) => (
                <div key={index} className="border-l-2 border-blue-400 pl-3 hover:bg-gray-50 transition-colors p-2 rounded">
                  <h4 className="font-medium text-gray-800 line-clamp-2">{post.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span>r/{post.subreddit}</span>
                    <span>•</span>
                    <span>Score: {post.score}</span>
                    {post.comments !== undefined && (
                      <>
                        <span>•</span>
                        <span>{post.comments} comments</span>
                      </>
                    )}
                  </div>
                  {post.author && (
                    <p className="text-xs text-gray-500 mt-1">by u/{post.author}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p>No recent discussions found.</p>
              <p className="text-sm mt-2">This could be due to API limits or no recent community activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
