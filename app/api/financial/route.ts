import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Try to extract stock symbol from query
    const stockSymbol = extractStockSymbol(query)
    
    if (!stockSymbol || !process.env.ALPHA_VANTAGE_KEY) {
      return NextResponse.json({})
    }
    
    // Alpha Vantage API for stock data
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: stockSymbol,
        apikey: process.env.ALPHA_VANTAGE_KEY
      }
    })
    
    const quote = response.data['Global Quote']
    if (!quote) {
      return NextResponse.json({})
    }
    
    const stockData = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      marketCap: 0 // Would need additional API call
    }
    
    // Mock historical data
    const historicalPrices = generateMockHistoricalData(stockData.price)
    
    return NextResponse.json({
      stockData,
      historicalPrices
    })
  } catch (error) {
    console.error('Financial API error:', error)
    return NextResponse.json({})
  }
}

function extractStockSymbol(query: string): string | null {
  // Simple extraction - would need more sophisticated logic
  const upperQuery = query.toUpperCase()
  const matches = upperQuery.match(/\b[A-Z]{1,5}\b/)
  return matches ? matches[0] : null
}

function generateMockHistoricalData(currentPrice: number) {
  const data = []
  const days = 30
  let price = currentPrice
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.5) * 4
    price = Math.max(price + change, 1)
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: parseFloat(price.toFixed(2))
    })
  }
  
  return data
}