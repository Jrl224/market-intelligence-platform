#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define API configurations
const API_CONFIGS = [
  { key: 'SERPAPI_KEY', name: 'SerpAPI', required: true, category: 'Search & Trends' },
  { key: 'NEWSAPI_KEY', name: 'NewsAPI', required: true, category: 'News' },
  { key: 'REDDIT_CLIENT_ID', name: 'Reddit Client ID', required: false, category: 'Social' },
  { key: 'REDDIT_CLIENT_SECRET', name: 'Reddit Client Secret', required: false, category: 'Social' },
  { key: 'YOUTUBE_API_KEY', name: 'YouTube', required: false, category: 'Social' },
  { key: 'OPENAI_API_KEY', name: 'OpenAI', required: false, category: 'AI', note: 'At least one AI provider required' },
  { key: 'ANTHROPIC_API_KEY', name: 'Anthropic', required: false, category: 'AI', note: 'At least one AI provider required' },
  { key: 'GEMINI_API_KEY', name: 'Gemini', required: false, category: 'AI', note: 'At least one AI provider required' },
  { key: 'FRED_API_KEY', name: 'FRED', required: false, category: 'Economic' },
  { key: 'ALPHA_VANTAGE_KEY', name: 'Alpha Vantage', required: false, category: 'Financial' },
  { key: 'SEMANTIC_SCHOLAR_KEY', name: 'Semantic Scholar', required: false, category: 'Research' },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log(`${colors.yellow}⚠️  No .env.local file found${colors.reset}`);
  console.log(`\nCreating .env.local from .env.example...`);
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}✅ Created .env.local${colors.reset}`);
    console.log(`\nPlease add your API keys to .env.local`);
  } else {
    console.log(`${colors.red}❌ No .env.example file found${colors.reset}`);
  }
  process.exit(0);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, value] = trimmedLine.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// Check API configuration
console.log(`\n${colors.bright}${colors.blue}🔍 Market Intelligence Platform - Environment Check${colors.reset}\n`);

let hasRequired = true;
let hasAnyAI = false;
const categories = {};

// Group by category
API_CONFIGS.forEach(config => {
  if (!categories[config.category]) {
    categories[config.category] = [];
  }
  categories[config.category].push(config);
});

// Check each category
Object.entries(categories).forEach(([category, configs]) => {
  console.log(`${colors.cyan}${category}:${colors.reset}`);
  
  configs.forEach(config => {
    const value = envVars[config.key];
    const isConfigured = value && value !== `your_${config.key.toLowerCase()}`;
    
    if (config.category === 'AI' && isConfigured) {
      hasAnyAI = true;
    }
    
    if (config.required && !isConfigured) {
      hasRequired = false;
    }
    
    const status = isConfigured 
      ? `${colors.green}✓ Configured${colors.reset}`
      : config.required 
        ? `${colors.red}✗ Missing (Required)${colors.reset}`
        : `${colors.yellow}○ Not configured${colors.reset}`;
    
    console.log(`  ${config.name}: ${status}`);
    if (config.note && !isConfigured) {
      console.log(`    ${colors.yellow}Note: ${config.note}${colors.reset}`);
    }
  });
  console.log('');
});

// Summary
console.log(`${colors.bright}Summary:${colors.reset}`);
const configuredCount = API_CONFIGS.filter(c => {
  const value = envVars[c.key];
  return value && value !== `your_${c.key.toLowerCase()}`;
}).length;

console.log(`  APIs configured: ${configuredCount}/${API_CONFIGS.length}`);

if (!hasRequired) {
  console.log(`\n${colors.red}❌ Missing required APIs. The platform needs at least:${colors.reset}`);
  console.log(`  - SerpAPI (for Google Trends)`);
  console.log(`  - NewsAPI (for news articles)`);
  console.log(`  - At least one AI provider (OpenAI, Anthropic, or Gemini)`);
} else if (!hasAnyAI) {
  console.log(`\n${colors.yellow}⚠️  No AI provider configured. Add at least one:${colors.reset}`);
  console.log(`  - OpenAI, Anthropic, or Gemini`);
} else {
  console.log(`\n${colors.green}✅ All required APIs are configured!${colors.reset}`);
}

console.log(`\n${colors.cyan}📚 Setup Guide:${colors.reset}`);
console.log(`  https://github.com/Jrl224/market-intelligence-platform#api-key-resources\n`);
