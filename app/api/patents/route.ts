import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Mock patent data - USPTO API would require more complex integration
    const patents = [
      {
        title: `Advanced ${query} System and Method`,
        inventor: 'John Doe',
        assignee: 'Tech Corp',
        date: '2024-08-15',
        abstract: `An innovative approach to ${query} that improves efficiency...`,
        patentNumber: 'US11234567B2'
      },
      {
        title: `${query} Optimization Process`,
        inventor: 'Jane Smith',
        assignee: 'Innovation Labs',
        date: '2024-06-20',
        abstract: `A method for optimizing ${query} performance through...`,
        patentNumber: 'US11234568B2'
      }
    ]
    
    return NextResponse.json({
      patents,
      totalCount: 47
    })
  } catch (error) {
    console.error('Patents API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patents data' },
      { status: 500 }
    )
  }
}