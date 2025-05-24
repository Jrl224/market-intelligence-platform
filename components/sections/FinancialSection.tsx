'use client'

import { Line } from 'react-chartjs-2'
import { FinancialData } from '@/types'

interface FinancialSectionProps {
  data: FinancialData
}

export default function FinancialSection({ data }: FinancialSectionProps) {
  if (!data.stockData && !data.historicalPrices) {
    return <p className="text-gray-600">No financial data available.</p>
  }
  
  const chartData = data.historicalPrices ? {
    labels: data.historicalPrices.map(item => item.date),
    datasets: [
      {
        label: 'Stock Price',
        data: data.historicalPrices.map(item => item.close),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  } : null
  
  return (
    <div className="space-y-6">
      {data.stockData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{data.stockData.symbol}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${data.stockData.price.toFixed(2)}
              </p>
            </div>
            <div className={`text-right ${data.stockData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <p className="text-lg font-semibold">
                {data.stockData.change > 0 ? '+' : ''}{data.stockData.change.toFixed(2)}
              </p>
              <p className="text-sm">
                ({data.stockData.changePercent > 0 ? '+' : ''}{data.stockData.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">{data.stockData.volume && <div><span className="text-gray-600">Volume:</span> <span className="font-medium">{data.stockData.volume.toLocaleString()}</span></div>}
            {data.stockData.marketCap && <div><span className="text-gray-600">Market Cap:</span> <span className="font-medium">${(data.stockData.marketCap / 1e9).toFixed(2)}B</span></div>}</div>
        </div>
      )}
      
      {chartData && data.historicalPrices && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Price History</h3>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      )}
    </div>
  )
}