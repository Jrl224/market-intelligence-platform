'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { SentimentData } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface SentimentSectionProps {
  data: SentimentData
}

export default function SentimentSection({ data }: SentimentSectionProps) {
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          data.youtubeSentiment.positive,
          data.youtubeSentiment.neutral,
          data.youtubeSentiment.negative
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Overall Sentiment</h3>
          <div className="w-64 mx-auto">
            <Doughnut data={chartData} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Recent Reddit Discussions</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">{data.redditPosts?.slice(0, 5).map((post, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-3">
                <h4 className="font-medium text-gray-800">{post.title}</h4>
                <p className="text-sm text-gray-600">r/{post.subreddit} • Score: {post.score}</p>
              </div>
            ))}</div>
        </div>
      </div>
    </div>
  )
}