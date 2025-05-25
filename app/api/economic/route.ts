import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface EconomicIndicator {
  name: string
  value: number
  unit: string
  date: string
  change?: number
  source?: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    const indicators: EconomicIndicator[] = []
    const errors: string[] = []
    
    // FRED API (Federal Reserve Economic Data)
    if (process.env.FRED_API_KEY) {
      try {
        // Key economic indicators series IDs
        const fredSeries = [
          { id: 'GDPC1', name: 'GDP Growth Rate', unit: '%', isGrowthRate: true },
          { id: 'UNRATE', name: 'Unemployment Rate', unit: '%' },
          { id: 'CPIAUCSL', name: 'Consumer Price Index', unit: 'Index' },
          { id: 'DFF', name: 'Federal Funds Rate', unit: '%' },
          { id: 'DEXUSEU', name: 'USD/EUR Exchange Rate', unit: 'USD per EUR' },
          { id: 'DGS10', name: '10-Year Treasury Rate', unit: '%' },
          { id: 'HOUST', name: 'Housing Starts', unit: 'Thousands of Units' },
          { id: 'INDPRO', name: 'Industrial Production Index', unit: 'Index' }
        ]
        
        const fredPromises = fredSeries.map(async (series) => {
          try {
            const response = await axios.get(
              'https://api.stlouisfed.org/fred/series/observations',
              {
                params: {
                  series_id: series.id,
                  api_key: process.env.FRED_API_KEY,
                  limit: 2,
                  sort_order: 'desc',
                  file_type: 'json'
                },
                timeout: 5000
              }
            )
            
            if (response.data.observations?.length > 0) {
              const latest = response.data.observations[0]
              const previous = response.data.observations[1]
              
              let value = parseFloat(latest.value)
              let change = undefined
              
              // Handle GDP Growth Rate calculation specifically
              if (series.isGrowthRate && previous) {
                // For GDP, calculate annualized growth rate
                const latestVal = parseFloat(latest.value)
                const prevVal = parseFloat(previous.value)
                if (!isNaN(latestVal) && !isNaN(prevVal) && prevVal !== 0) {
                  // Calculate quarterly growth rate and annualize it
                  const quarterlyGrowth = ((latestVal - prevVal) / prevVal) * 100
                  value = Number((quarterlyGrowth * 4).toFixed(2)) // Annualized
                  // Ensure reasonable bounds for GDP growth
                  if (Math.abs(value) > 50) {
                    value = quarterlyGrowth // Use quarterly if annualized seems wrong
                  }
                }
              } else if (previous && !isNaN(parseFloat(latest.value)) && !isNaN(parseFloat(previous.value))) {
                const latestVal = parseFloat(latest.value)
                const prevVal = parseFloat(previous.value)
                
                if (series.unit === '%') {
                  // For percentages, show absolute change
                  change = Number((latestVal - prevVal).toFixed(2))
                } else if (prevVal !== 0) {
                  // For other values, show percentage change
                  change = Number(((latestVal - prevVal) / prevVal * 100).toFixed(2))
                }
              }
              
              indicators.push({
                name: series.name,
                value: value,
                unit: series.unit,
                date: formatDate(latest.date),
                change: change,
                source: 'FRED'
              })
            }
          } catch (seriesError) {
            console.error(`FRED series ${series.id} error:`, seriesError)
          }
        })
        
        await Promise.allSettled(fredPromises)
      } catch (fredError) {
        console.error('FRED API error:', fredError)
        errors.push('FRED data unavailable')
      }
    }
    
    // World Bank API (for international data)
    try {
      const worldBankIndicators = [
        { id: 'NY.GDP.MKTP.KD.ZG', name: 'World GDP Growth', unit: '%' },
        { id: 'FP.CPI.TOTL.ZG', name: 'Global Inflation Rate', unit: '%' },
        { id: 'SL.UEM.TOTL.ZS', name: 'Global Unemployment', unit: '%' }
      ]
      
      const wbPromises = worldBankIndicators.map(async (indicator) => {
        try {
          const currentYear = new Date().getFullYear()
          const response = await axios.get(
            `https://api.worldbank.org/v2/country/WLD/indicator/${indicator.id}`,
            {
              params: {
                format: 'json',
                date: `${currentYear - 5}:${currentYear}`,
                per_page: 10
              },
              timeout: 5000
            }
          )
          
          if (response.data?.[1]?.length > 0) {
            const data = response.data[1]
            // Find the most recent non-null value
            const latestData = data.find((d: any) => d.value !== null)
            
            if (latestData) {
              indicators.push({
                name: indicator.name,
                value: Number(latestData.value.toFixed(2)),
                unit: indicator.unit,
                date: `${latestData.date}`,
                source: 'World Bank'
              })
            }
          }
        } catch (wbError) {
          console.error(`World Bank indicator ${indicator.id} error:`, wbError)
        }
      })
      
      await Promise.allSettled(wbPromises)
    } catch (wbError) {
      console.error('World Bank API error:', wbError)
      errors.push('World Bank data unavailable')
    }
    
    // Alpha Vantage for market data
    if (process.env.ALPHA_VANTAGE_KEY) {
      try {
        // Get S&P 500 data
        const spxResponse = await axios.get(
          'https://www.alphavantage.co/query',
          {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: 'SPX',
              apikey: process.env.ALPHA_VANTAGE_KEY
            },
            timeout: 5000
          }
        )
        
        if (spxResponse.data['Global Quote']) {
          const quote = spxResponse.data['Global Quote']
          indicators.push({
            name: 'S&P 500 Index',
            value: parseFloat(quote['05. price']),
            unit: 'Points',
            date: formatDate(quote['07. latest trading day']),
            change: parseFloat(quote['10. change percent'].replace('%', '')),
            source: 'Alpha Vantage'
          })
        }
      } catch (avError) {
        console.error('Alpha Vantage error:', avError)
      }
    }
    
    // If no real data available, provide informative message with realistic mock data
    if (indicators.length === 0) {
      // Get realistic mock indicators
      const currentDate = new Date()
      const mockIndicators: EconomicIndicator[] = [
        {
          name: 'GDP Growth Rate',
          value: 2.8,
          unit: '%',
          date: formatDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          change: 0.3,
          source: 'Mock Data'
        },
        {
          name: 'Unemployment Rate',
          value: 3.9,
          unit: '%',
          date: formatDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          change: -0.1,
          source: 'Mock Data'
        },
        {
          name: 'Consumer Price Index',
          value: 307.671,
          unit: 'Index',
          date: formatDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          change: 2.6,
          source: 'Mock Data'
        },
        {
          name: 'Federal Funds Rate',
          value: 4.58,
          unit: '%',
          date: formatDate(new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()),
          change: 0,
          source: 'Mock Data'
        },
        {
          name: '10-Year Treasury Rate',
          value: 4.25,
          unit: '%',
          date: formatDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          change: 0.05,
          source: 'Mock Data'
        },
        {
          name: 'S&P 500 Index',
          value: 5234.18,
          unit: 'Points',
          date: formatDate(new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()),
          change: 0.62,
          source: 'Mock Data'
        }
      ]
      
      return NextResponse.json({
        indicators: mockIndicators,
        message: 'Economic data APIs not configured. Showing sample data.',
        errors: errors
      })
    }
    
    // Sort indicators by importance/relevance
    const sortOrder = ['GDP Growth Rate', 'Unemployment Rate', 'Consumer Price Index', 'Federal Funds Rate', '10-Year Treasury Rate', 'S&P 500 Index']
    indicators.sort((a, b) => {
      const aIndex = sortOrder.indexOf(a.name)
      const bIndex = sortOrder.indexOf(b.name)
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return 0
    })
    
    return NextResponse.json({
      indicators: indicators.slice(0, 12),
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Economic API error:', error)
    return NextResponse.json({
      indicators: [],
      error: 'Unable to fetch economic data'
    })
  }
}

// Helper function to format dates properly
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr // Return original if parsing fails
    }
    return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
  } catch (error) {
    return dateStr
  }
}