import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Mock economic indicators - FRED API would require proper integration
    const indicators = [
      {
        name: 'GDP Growth Rate',
        value: 2.8,
        unit: '%',
        date: '2024-Q3',
        change: 0.3
      },
      {
        name: 'Unemployment Rate',
        value: 3.9,
        unit: '%',
        date: '2024-10',
        change: -0.1
      },
      {
        name: 'Consumer Price Index',
        value: 307.671,
        unit: 'Index',
        date: '2024-10',
        change: 2.6
      },
      {
        name: 'Federal Funds Rate',
        value: 4.58,
        unit: '%',
        date: '2024-11',
        change: 0
      }
    ]
    
    return NextResponse.json({ indicators })
  } catch (error) {
    console.error('Economic API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch economic data' },
      { status: 500 }
    )
  }
}