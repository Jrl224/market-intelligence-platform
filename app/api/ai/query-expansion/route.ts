import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export interface QueryExpansion {
  originalQuery: string
  expandedTerms: string[]
  category: {
    name: string
    description: string
    confidence: number
  }
  competitors: string[]
  relatedBrands: string[]
  productTypes: string[]
  industryContext: string
  searchStrategy: {
    primary: string[]
    secondary: string[]
    contextual: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }
    
    // Try to use OpenAI first, fallback to intelligent mock data
    const expansion = await generateQueryExpansion(query)
    
    return NextResponse.json(expansion)
  } catch (error) {
    console.error('Query expansion error:', error)
    return NextResponse.json(
      { error: 'Failed to expand query' },
      { status: 500 }
    )
  }
}

async function generateQueryExpansion(query: string): Promise<QueryExpansion> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a CPG (Consumer Packaged Goods) market intelligence expert. Analyze the search query and provide comprehensive expansion data for competitive intelligence. Focus on cleaning products, personal care, household products, and related CPG categories. Return JSON in this exact format:
              {
                "originalQuery": "the original query",
                "expandedTerms": ["related search terms", "synonyms", "category terms"],
                "category": {
                  "name": "identified product category",
                  "description": "brief description of the category",
                  "confidence": 0.95
                },
                "competitors": ["direct competitor brands"],
                "relatedBrands": ["brands in same category or parent company"],
                "productTypes": ["specific product types in this category"],
                "industryContext": "2-3 sentences about the industry/category context",
                "searchStrategy": {
                  "primary": ["main search terms to use"],
                  "secondary": ["broader category terms"],
                  "contextual": ["industry and market terms"]
                }
              }`
            },
            {
              role: 'user',
              content: `Analyze this CPG product/brand query and provide market intelligence expansion: "${query}"`
            }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return JSON.parse(response.data.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI query expansion error:', error)
    }
  }
  
  // Fallback to intelligent pattern matching
  return generateSmartExpansion(query)
}

function generateSmartExpansion(query: string): QueryExpansion {
  const queryLower = query.toLowerCase()
  
  // CPG brand and category mappings
  const brandMappings: Record<string, any> = {
    'oxiclean': {
      category: 'Laundry Care',
      competitors: ['Tide', 'Gain', 'Persil', 'All', 'Arm & Hammer'],
      parent: 'Church & Dwight',
      productTypes: ['stain removers', 'laundry detergent', 'pre-treatment', 'powder detergent']
    },
    'tide': {
      category: 'Laundry Care',
      competitors: ['OxiClean', 'Gain', 'Persil', 'All', 'Arm & Hammer'],
      parent: 'Procter & Gamble',
      productTypes: ['liquid detergent', 'pods', 'powder detergent', 'stain removers']
    },
    'arm & hammer': {
      category: 'Multi-category CPG',
      competitors: ['Crest', 'Colgate', 'Tide', 'OxiClean', 'Glad'],
      parent: 'Church & Dwight',
      productTypes: ['baking soda', 'toothpaste', 'laundry detergent', 'cat litter', 'deodorant']
    },
    'method': {
      category: 'Eco-friendly Cleaning',
      competitors: ['Seventh Generation', 'Mrs. Meyer\'s', 'Ecover', 'Better Life'],
      parent: 'SC Johnson',
      productTypes: ['all-purpose cleaners', 'dish soap', 'hand soap', 'laundry detergent']
    },
    'lysol': {
      category: 'Disinfectants',
      competitors: ['Clorox', 'Microban', 'Pine-Sol', 'Mr. Clean'],
      parent: 'Reckitt Benckiser',
      productTypes: ['disinfectant spray', 'wipes', 'toilet bowl cleaner', 'all-purpose cleaner']
    },
    'clorox': {
      category: 'Cleaning & Disinfecting',
      competitors: ['Lysol', 'Pine-Sol', 'Mr. Clean', 'Comet'],
      parent: 'The Clorox Company',
      productTypes: ['bleach', 'disinfecting wipes', 'toilet bowl cleaner', 'all-purpose cleaner']
    }
  }
  
  // Category mappings
  const categoryMappings: Record<string, any> = {
    'cleaning': {
      brands: ['Lysol', 'Clorox', 'Mr. Clean', 'Pine-Sol', 'Method', 'Seventh Generation'],
      terms: ['disinfectant', 'sanitizer', 'all-purpose cleaner', 'surface cleaner']
    },
    'laundry': {
      brands: ['Tide', 'Gain', 'OxiClean', 'Persil', 'All', 'Arm & Hammer'],
      terms: ['detergent', 'stain remover', 'fabric softener', 'laundry pods']
    },
    'personal care': {
      brands: ['Dove', 'Olay', 'Nivea', 'Aveeno', 'Old Spice', 'Secret'],
      terms: ['body wash', 'shampoo', 'deodorant', 'lotion', 'soap']
    }
  }
  
  // Find best match
  let matchedBrand = null
  let matchedCategory = null
  
  for (const [brand, data] of Object.entries(brandMappings)) {
    if (queryLower.includes(brand)) {
      matchedBrand = { brand, ...data }
      break
    }
  }
  
  for (const [category, data] of Object.entries(categoryMappings)) {
    if (queryLower.includes(category)) {
      matchedCategory = { category, ...data }
      break
    }
  }
  
  // Build expansion based on matches
  if (matchedBrand) {
    return {
      originalQuery: query,
      expandedTerms: [
        ...matchedBrand.productTypes,
        matchedBrand.category.toLowerCase(),
        'CPG products',
        'consumer goods'
      ],
      category: {
        name: matchedBrand.category,
        description: `${matchedBrand.category} products including ${matchedBrand.productTypes.slice(0, 3).join(', ')}`,
        confidence: 0.95
      },
      competitors: matchedBrand.competitors,
      relatedBrands: [matchedBrand.parent, ...matchedBrand.competitors.slice(0, 3)],
      productTypes: matchedBrand.productTypes,
      industryContext: `The ${matchedBrand.category} market is highly competitive with major players like ${matchedBrand.competitors.slice(0, 3).join(', ')}. Key factors include efficacy, price point, brand loyalty, and increasingly, environmental sustainability.`,
      searchStrategy: {
        primary: [query, ...matchedBrand.competitors.slice(0, 2)],
        secondary: [matchedBrand.category, ...matchedBrand.productTypes.slice(0, 2)],
        contextual: ['CPG market', 'consumer packaged goods', `${matchedBrand.category} industry`]
      }
    }
  }
  
  if (matchedCategory) {
    return {
      originalQuery: query,
      expandedTerms: [
        ...matchedCategory.terms,
        ...matchedCategory.brands.slice(0, 3),
        'CPG products'
      ],
      category: {
        name: matchedCategory.category,
        description: `${matchedCategory.category} products and related consumer goods`,
        confidence: 0.85
      },
      competitors: matchedCategory.brands,
      relatedBrands: matchedCategory.brands,
      productTypes: matchedCategory.terms,
      industryContext: `The ${matchedCategory.category} category includes major brands like ${matchedCategory.brands.slice(0, 3).join(', ')}. Market dynamics focus on innovation, brand differentiation, and consumer preferences.`,
      searchStrategy: {
        primary: [query, ...matchedCategory.brands.slice(0, 2)],
        secondary: matchedCategory.terms.slice(0, 3),
        contextual: [`${matchedCategory.category} market`, 'CPG industry', 'consumer goods']
      }
    }
  }
  
  // Generic expansion for unmatched queries
  return {
    originalQuery: query,
    expandedTerms: [
      query,
      `${query} products`,
      `${query} brands`,
      `${query} market`,
      'consumer goods',
      'CPG products'
    ],
    category: {
      name: 'General CPG',
      description: 'Consumer packaged goods and related products',
      confidence: 0.5
    },
    competitors: ['Market leaders', 'Regional brands', 'Private label'],
    relatedBrands: ['Leading CPG companies'],
    productTypes: ['Consumer products', 'Household goods', 'Personal care items'],
    industryContext: `The CPG market for "${query}" encompasses various consumer products. Further analysis needed to identify specific category and competitive landscape.`,
    searchStrategy: {
      primary: [query, `${query} products`, `${query} brands`],
      secondary: ['consumer goods', 'CPG market', 'retail products'],
      contextual: ['market analysis', 'competitive intelligence', 'industry trends']
    }
  }
}
