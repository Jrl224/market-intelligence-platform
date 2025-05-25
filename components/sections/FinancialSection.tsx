'use client'

import { FinancialData } from '@/types'

interface FinancialSectionProps {
  data: FinancialData
}

export default function FinancialSection({ data }: FinancialSectionProps) {
  if (!data.stocks || data.stocks.length === 0) {
    return <p className="text-gray-600">No financial data available.</p>
  }
  
  return (
    <div className="space-y-6">
      {data.stocks.map((stock, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stock.symbol}</h3>
              <p className="text-lg text-gray-600">{stock.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stock.price.toFixed(2)}
              </p>
            </div>
            <div className={`text-right ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <p className="text-lg font-semibold">
                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
              </p>
              <p className="text-sm">
                ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-600">Volume:</span> <span className="font-medium">{stock.volume.toLocaleString()}</span></div>
            {stock.marketCap && <div><span className="text-gray-600">Market Cap:</span> <span className="font-medium">${(stock.marketCap / 1e9).toFixed(2)}B</span></div>}
            {stock.pe && <div><span className="text-gray-600">P/E Ratio:</span> <span className="font-medium">{stock.pe.toFixed(2)}</span></div>}
            {stock.high52Week && <div><span className="text-gray-600">52W High:</span> <span className="font-medium">${stock.high52Week.toFixed(2)}</span></div>}
            {stock.low52Week && <div><span className="text-gray-600">52W Low:</span> <span className="font-medium">${stock.low52Week.toFixed(2)}</span></div>}
          </div>
        </div>
      ))}
      
      {data.marketIndices && data.marketIndices.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Market Indices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.marketIndices.map((index, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600">{index.name}</h4>
                <p className="text-xl font-bold text-gray-800">
                  {index.value.toLocaleString()}
                </p>
                <p className={`text-sm ${index.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.message && (
        <p className="text-yellow-600 text-sm">{data.message}</p>
      )}
    </div>
  )
}