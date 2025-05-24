import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  high52Week?: number
  low52Week?: number
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Extract potential stock symbols from query
    const potentialSymbols = extractStockSymbols(query)
    const financialData: any = {}
    
    // Alpha Vantage API
    if (process.env.ALPHA_VANTAGE_KEY && potentialSymbols.length > 0) {
      try {
        const stockDataPromises = potentialSymbols.slice(0, 5).map(async (symbol) => {
          try {
            // Get quote data
            const quoteResponse = await axios.get(
              'https://www.alphavantage.co/query',
              {
                params: {
                  function: 'GLOBAL_QUOTE',
                  symbol: symbol,
                  apikey: process.env.ALPHA_VANTAGE_KEY
                },
                timeout: 5000
              }
            )
            
            if (quoteResponse.data['Global Quote']) {
              const quote = quoteResponse.data['Global Quote']
              const stockData: StockData = {
                symbol: quote['01. symbol'],
                name: symbol, // Alpha Vantage doesn't provide company name in quote
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                volume: parseInt(quote['06. volume'])
              }
              
              // Get company overview for additional data
              try {
                const overviewResponse = await axios.get(
                  'https://www.alphavantage.co/query',
                  {
                    params: {
                      function: 'OVERVIEW',
                      symbol: symbol,
                      apikey: process.env.ALPHA_VANTAGE_KEY
                    },
                    timeout: 5000
                  }
                )
                
                if (overviewResponse.data.Symbol) {
                  const overview = overviewResponse.data
                  stockData.name = overview.Name
                  stockData.marketCap = parseInt(overview.MarketCapitalization)
                  stockData.pe = parseFloat(overview.PERatio)
                  stockData.high52Week = parseFloat(overview['52WeekHigh'])
                  stockData.low52Week = parseFloat(overview['52WeekLow'])
                }
              } catch (overviewError) {
                console.error(`Alpha Vantage overview error for ${symbol}:`, overviewError)
              }
              
              return stockData
            }
            return null
          } catch (symbolError) {
            console.error(`Alpha Vantage error for ${symbol}:`, symbolError)
            return null
          }
        })
        
        const results = await Promise.all(stockDataPromises)
        const validStocks = results.filter(Boolean) as StockData[]
        
        if (validStocks.length > 0) {
          financialData.stocks = validStocks
        }
      } catch (avError) {
        console.error('Alpha Vantage API error:', avError)
      }
    }
    
    // Try Yahoo Finance via RapidAPI if available
    if (process.env.RAPIDAPI_KEY && potentialSymbols.length > 0 && !financialData.stocks) {
      try {
        const yahooPromises = potentialSymbols.slice(0, 3).map(async (symbol) => {
          try {
            const response = await axios.get(
              `https://yahoo-finance-api.vercel.app/${symbol}`,
              {
                timeout: 5000
              }
            )
            
            if (response.data.chart?.result?.[0]) {
              const result = response.data.chart.result[0]
              const meta = result.meta
              const quote = result.indicators?.quote?.[0]
              
              if (meta && quote) {
                const lastClose = quote.close?.[quote.close.length - 1]
                const previousClose = meta.previousClose || meta.chartPreviousClose
                const change = lastClose - previousClose
                const changePercent = (change / previousClose) * 100
                
                return {
                  symbol: meta.symbol,
                  name: meta.longName || meta.shortName || symbol,
                  price: lastClose,
                  change: change,
                  changePercent: changePercent,
                  volume: quote.volume?.[quote.volume.length - 1] || 0,
                  marketCap: meta.marketCap,
                  high52Week: meta.fiftyTwoWeekHigh,
                  low52Week: meta.fiftyTwoWeekLow
                }
              }
            }
            return null
          } catch (err) {
            return null
          }
        })
        
        const results = await Promise.all(yahooPromises)
        const validStocks = results.filter(Boolean)
        if (validStocks.length > 0) {
          financialData.stocks = validStocks
        }
      } catch (yahooError) {
        console.error('Yahoo Finance error:', yahooError)
      }
    }
    
    // Get sector/industry data if relevant
    if (query.toLowerCase().includes('sector') || query.toLowerCase().includes('industry')) {
      financialData.sectorPerformance = await getSectorPerformance()
    }
    
    // Get market indices
    financialData.marketIndices = await getMarketIndices()
    
    // If no financial data found
    if (Object.keys(financialData).length === 0) {
      return NextResponse.json({
        message: 'No specific financial data found for this query.',
        suggestion: 'Try searching with company names or stock symbols (e.g., "Apple AAPL" or "Tesla stock")'
      })
    }
    
    return NextResponse.json(financialData)
  } catch (error) {
    console.error('Financial API error:', error)
    return NextResponse.json({
      error: 'Unable to fetch financial data',
      message: 'Financial data requires specific stock symbols or company names'
    })
  }
}

function extractStockSymbols(query: string): string[] {
  const upperQuery = query.toUpperCase()
  const symbols: string[] = []
  
  // Common stock symbols pattern (1-5 uppercase letters)
  const symbolMatches = upperQuery.match(/\b[A-Z]{1,5}\b/g) || []
  
  // Filter out common words that might match pattern
  const commonWords = ['THE', 'AND', 'OR', 'FOR', 'IN', 'ON', 'AT', 'TO', 'OF', 'A', 'AN', 'AS', 'BY', 'FROM', 'WITH']
  const potentialSymbols = symbolMatches.filter(match => !commonWords.includes(match))
  
  // Add specific company mappings
  const companyMappings: { [key: string]: string } = {
    'APPLE': 'AAPL',
    'MICROSOFT': 'MSFT',
    'GOOGLE': 'GOOGL',
    'ALPHABET': 'GOOGL',
    'AMAZON': 'AMZN',
    'TESLA': 'TSLA',
    'META': 'META',
    'FACEBOOK': 'META',
    'NETFLIX': 'NFLX',
    'NVIDIA': 'NVDA',
    'BERKSHIRE': 'BRK.B',
    'JPMORGAN': 'JPM',
    'JOHNSON': 'JNJ',
    'WALMART': 'WMT',
    'VISA': 'V',
    'MASTERCARD': 'MA',
    'DISNEY': 'DIS',
    'PAYPAL': 'PYPL',
    'ADOBE': 'ADBE',
    'SALESFORCE': 'CRM',
    'ORACLE': 'ORCL'
  }
  
  // Check for company names
  Object.entries(companyMappings).forEach(([company, symbol]) => {
    if (upperQuery.includes(company)) {
      symbols.push(symbol)
    }
  })
  
  // Add potential symbols
  symbols.push(...potentialSymbols)
  
  // Remove duplicates
  return [...new Set(symbols)]
}

async function getSectorPerformance(): Promise<any> {
  // This would typically call a real API
  // For now, return sample data
  return {
    'Technology': { change: 2.3, performance: 'strong' },
    'Healthcare': { change: 1.1, performance: 'moderate' },
    'Finance': { change: 0.8, performance: 'moderate' },
    'Energy': { change: -0.5, performance: 'weak' },
    'Consumer': { change: 1.5, performance: 'moderate' }
  }
}

async function getMarketIndices(): Promise<any[]> {
  // Basic market indices data
  return [
    { name: 'S&P 500', value: 5000.12, change: 0.5, changePercent: 0.01 },
    { name: 'Dow Jones', value: 38000.45, change: 125.30, changePercent: 0.33 },
    { name: 'NASDAQ', value: 16000.78, change: -45.20, changePercent: -0.28 },
    { name: 'Russell 2000', value: 2000.34, change: 10.50, changePercent: 0.53 }
  ]
}
