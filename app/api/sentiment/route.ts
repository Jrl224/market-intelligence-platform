import { NextRequest, NextResponse } from 'next/server'
import { RedditClient } from '@/lib/api/clients/reddit-client'
import axios from 'axios'

interface YouTubeComment {
  textDisplay: string
  likeCount: number
  publishedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // Initialize Reddit client
    const redditClient = new RedditClient(
      process.env.REDDIT_CLIENT_ID || '',
      process.env.REDDIT_CLIENT_SECRET || ''
    )
    
    // Fetch Reddit data
    const redditPromises = [
      redditClient.searchPosts(query, 10),
      redditClient.getSubredditPosts('technology', query, 5),
      redditClient.getSubredditPosts('business', query, 5),
      redditClient.getSubredditPosts('investing', query, 5)
    ]
    
    const redditResults = await Promise.allSettled(redditPromises)
    
    // Combine all Reddit posts
    const allRedditPosts = redditResults
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => (result as any).value)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
    
    // Format Reddit posts for frontend
    const redditPosts = allRedditPosts.map(post => ({
      title: post.title,
      content: post.selftext || 'No content',
      subreddit: post.subreddit,
      score: post.score,
      comments: post.num_comments,
      url: post.url || `https://reddit.com${post.permalink}`,
      author: post.author,
      created: new Date(post.created_utc * 1000).toISOString()
    }))
    
    // Analyze Reddit sentiment
    const redditSentiment = await redditClient.analyzeSentiment(allRedditPosts)
    
    // YouTube sentiment analysis
    let youtubeSentiment = { positive: 0, neutral: 0, negative: 0 }
    
    if (process.env.YOUTUBE_API_KEY) {
      try {
        // Search for related videos
        const videoSearchResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              key: process.env.YOUTUBE_API_KEY,
              q: query,
              part: 'id',
              type: 'video',
              maxResults: 5,
              order: 'relevance'
            }
          }
        )
        
        const videoIds = videoSearchResponse.data.items
          .map((item: any) => item.id.videoId)
          .filter(Boolean)
        
        if (videoIds.length > 0) {
          // Get comments for these videos
          const commentPromises = videoIds.map((videoId: string) =>
            axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
              params: {
                key: process.env.YOUTUBE_API_KEY,
                videoId: videoId,
                part: 'snippet',
                maxResults: 20,
                order: 'relevance'
              }
            }).catch(() => null)
          )
          
          const commentResponses = await Promise.all(commentPromises)
          const allComments: YouTubeComment[] = commentResponses
            .filter(Boolean)
            .flatMap(response => 
              response?.data.items.map((item: any) => ({
                textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
                likeCount: item.snippet.topLevelComment.snippet.likeCount,
                publishedAt: item.snippet.topLevelComment.snippet.publishedAt
              })) || []
            )
          
          // Simple sentiment analysis based on engagement
          allComments.forEach(comment => {
            if (comment.likeCount > 10) {
              youtubeSentiment.positive++
            } else if (comment.likeCount > 2) {
              youtubeSentiment.neutral++
            } else {
              youtubeSentiment.negative++
            }
          })
          
          const total = allComments.length || 1
          // Calculate raw percentages
          const rawPositive = (youtubeSentiment.positive / total) * 100
          const rawNeutral = (youtubeSentiment.neutral / total) * 100
          const rawNegative = (youtubeSentiment.negative / total) * 100
          
          // Ensure percentages sum to 100%
          youtubeSentiment = ensurePercentagesSum100({
            positive: rawPositive,
            neutral: rawNeutral,
            negative: rawNegative
          })
        }
      } catch (error) {
        console.error('YouTube API error:', error)
      }
    }
    
    // Ensure Reddit sentiment also sums to 100%
    redditSentiment.positive = redditSentiment.positive || 0
    redditSentiment.neutral = redditSentiment.neutral || 0
    redditSentiment.negative = redditSentiment.negative || 0
    
    const fixedRedditSentiment = ensurePercentagesSum100(redditSentiment)
    
    // Combine sentiments - calculate weighted average then ensure 100%
    const overallRaw = {
      positive: (fixedRedditSentiment.positive + youtubeSentiment.positive) / 2,
      neutral: (fixedRedditSentiment.neutral + youtubeSentiment.neutral) / 2,
      negative: (fixedRedditSentiment.negative + youtubeSentiment.negative) / 2
    }
    
    const overallSentiment = ensurePercentagesSum100(overallRaw)
    
    return NextResponse.json({
      redditPosts: redditPosts.slice(0, 10), // Top 10 posts
      youtubeSentiment,
      redditSentiment: fixedRedditSentiment,
      overallSentiment
    })
  } catch (error) {
    console.error('Sentiment API error:', error)
    
    // Return empty data instead of error
    return NextResponse.json({
      redditPosts: [],
      youtubeSentiment: { positive: 0, neutral: 0, negative: 0 },
      redditSentiment: { positive: 0, neutral: 0, negative: 0 },
      overallSentiment: { positive: 0, neutral: 0, negative: 0 }
    })
  }
}

// Helper function to ensure percentages sum to exactly 100
function ensurePercentagesSum100(sentiment: {positive: number, neutral: number, negative: number}) {
  const total = sentiment.positive + sentiment.neutral + sentiment.negative
  
  if (total === 0) {
    return { positive: 0, neutral: 100, negative: 0 }
  }
  
  // Calculate normalized percentages
  let positive = Math.round(sentiment.positive)
  let neutral = Math.round(sentiment.neutral)
  let negative = Math.round(sentiment.negative)
  
  // Adjust for rounding errors
  const sum = positive + neutral + negative
  const diff = 100 - sum
  
  if (diff !== 0) {
    // Add/subtract the difference to/from the largest value
    const values = [
      { key: 'positive', value: positive },
      { key: 'neutral', value: neutral },
      { key: 'negative', value: negative }
    ].sort((a, b) => b.value - a.value)
    
    if (values[0].key === 'positive') positive += diff
    else if (values[0].key === 'neutral') neutral += diff
    else negative += diff
  }
  
  return { positive, neutral, negative }
}