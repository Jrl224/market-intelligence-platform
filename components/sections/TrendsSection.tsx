'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { TrendsData } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface TrendsSectionProps {
  data: TrendsData
}

export default function TrendsSection({ data }: TrendsSectionProps) {
  // Handle both possible property names for backward compatibility
  const timelineData = data.timelineData || (data as any).searchInterest || []
  
  if (!timelineData || timelineData.length === 0) {
    return <p className="text-gray-600">No trends data available.</p>
  }
  
  const chartData = {
    labels: timelineData.map(item => item.date),
    datasets: [
      {
        label: 'Search Interest',
        data: timelineData.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Search Interest Over Time</h3>
        <Line data={chartData} options={options} />
      </div>
      
      {data.relatedQueries && data.relatedQueries.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Related Searches</h3>
          <div className="flex flex-wrap gap-2">
            {data.relatedQueries.map((query, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {query}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data.geographicDistribution && data.geographicDistribution.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Geographic Interest</h3>
          <div className="space-y-2">
            {data.geographicDistribution.slice(0, 5).map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{location.location}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${location.interest}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{location.interest}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}