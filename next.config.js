/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['serpapi.com', 'newsapi.org'],
  },
  env: {
    SERPAPI_KEY: process.env.SERPAPI_KEY,
    NEWSAPI_KEY: process.env.NEWSAPI_KEY,
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    CENSUS_API_KEY: process.env.CENSUS_API_KEY,
    FRED_API_KEY: process.env.FRED_API_KEY,
    CROSSREF_EMAIL: process.env.CROSSREF_EMAIL,
    SEMANTIC_SCHOLAR_KEY: process.env.SEMANTIC_SCHOLAR_KEY,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    ALPHA_VANTAGE_KEY: process.env.ALPHA_VANTAGE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  },
}

module.exports = nextConfig