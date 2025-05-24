import jsPDF from 'jspdf'
import { ReportData, ReportSection } from '@/types'

export async function generatePDF(data: ReportData) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin
  
  // Helper function to check if new page is needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPosition > pageHeight - requiredSpace) {
      pdf.addPage()
      yPosition = margin
    }
  }
  
  // Title
  pdf.setFontSize(24)
  pdf.setTextColor(0, 0, 0)
  pdf.text(data.query, margin, yPosition)
  yPosition += 15
  
  // Metadata
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Generated on ${new Date(data.timestamp).toLocaleString()}`, margin, yPosition)
  yPosition += 15
  
  // Summary
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  const summaryLines = pdf.splitTextToSize(data.summary, pageWidth - 2 * margin)
  summaryLines.forEach((line: string) => {
    checkNewPage()
    pdf.text(line, margin, yPosition)
    yPosition += 5
  })
  yPosition += 10
  
  // Process each section
  data.sections.forEach(section => {
    if (!section.visible || !section.data) return
    
    checkNewPage(40)
    
    // Section Title
    pdf.setFontSize(16)
    pdf.setTextColor(0, 102, 204)
    pdf.text(section.title, margin, yPosition)
    yPosition += 10
    
    // Section Content
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    switch (section.type) {
      case 'trends':
        addTrendsSection(pdf, section.data, margin, pageWidth)
        break
      case 'news':
        addNewsSection(pdf, section.data, margin, pageWidth)
        break
      case 'sentiment':
        addSentimentSection(pdf, section.data, margin, pageWidth)
        break
      case 'research':
        addResearchSection(pdf, section.data, margin, pageWidth)
        break
      case 'patents':
        addPatentsSection(pdf, section.data, margin, pageWidth)
        break
      case 'economic':
        addEconomicSection(pdf, section.data, margin, pageWidth)
        break
      case 'financial':
        addFinancialSection(pdf, section.data, margin, pageWidth)
        break
      case 'insights':
        addInsightsSection(pdf, section.data, margin, pageWidth)
        break
    }
    
    yPosition = (pdf as any).lastAutoTable?.finalY || yPosition + 20
  })
  
  // Save the PDF
  pdf.save(`${data.query.replace(/[^a-z0-9]/gi, '_')}_report_${new Date().toISOString().split('T')[0]}.pdf`)
  
  // Helper functions for each section type
  function addTrendsSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    if (data.relatedQueries?.length > 0) {
      pdf.setFontSize(12)
      pdf.text('Related Searches:', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      const queries = data.relatedQueries.slice(0, 10).join(', ')
      const queryLines = pdf.splitTextToSize(queries, pageWidth - 2 * margin)
      queryLines.forEach((line: string) => {
        checkNewPage()
        pdf.text(line, margin, yPosition)
        yPosition += 5
      })
      yPosition += 5
    }
    
    if (data.geographicDistribution?.length > 0) {
      checkNewPage()
      pdf.setFontSize(12)
      pdf.text('Geographic Interest:', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      data.geographicDistribution.slice(0, 5).forEach((loc: any) => {
        checkNewPage()
        pdf.text(`${loc.location}: ${loc.interest}%`, margin, yPosition)
        yPosition += 5
      })
    }
  }
  
  function addNewsSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    const articles = data.articles || []
    if (articles.length === 0) {
      pdf.text('No recent news articles found.', margin, yPosition)
      yPosition += 10
      return
    }
    
    articles.slice(0, 5).forEach((article: any, index: number) => {
      checkNewPage(30)
      
      // Title
      pdf.setFontSize(11)
      pdf.setFont(undefined, 'bold')
      const titleLines = pdf.splitTextToSize(article.title || 'Untitled', pageWidth - 2 * margin)
      titleLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition)
        yPosition += 5
      })
      
      // Source and date
      pdf.setFontSize(9)
      pdf.setFont(undefined, 'normal')
      pdf.setTextColor(100, 100, 100)
      const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date'
      pdf.text(`${article.source || 'Unknown source'} - ${date}`, margin, yPosition)
      yPosition += 5
      
      // Description
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      if (article.description) {
        const descLines = pdf.splitTextToSize(article.description.substring(0, 200) + '...', pageWidth - 2 * margin)
        descLines.forEach((line: string) => {
          checkNewPage()
          pdf.text(line, margin, yPosition)
          yPosition += 5
        })
      }
      
      yPosition += 5
    })
  }
  
  function addSentimentSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    // Overall sentiment
    if (data.overallSentiment || data.youtubeSentiment || data.redditSentiment) {
      const sentiment = data.overallSentiment || data.youtubeSentiment || data.redditSentiment || {}
      pdf.text('Overall Sentiment:', margin, yPosition)
      yPosition += 7
      pdf.setFontSize(10)
      pdf.text(`Positive: ${sentiment.positive || 0}%`, margin, yPosition)
      yPosition += 5
      pdf.text(`Neutral: ${sentiment.neutral || 0}%`, margin, yPosition)
      yPosition += 5
      pdf.text(`Negative: ${sentiment.negative || 0}%`, margin, yPosition)
      yPosition += 10
    }
    
    // Reddit posts
    if (data.redditPosts?.length > 0) {
      checkNewPage()
      pdf.setFontSize(12)
      pdf.text('Recent Reddit Discussions:', margin, yPosition)
      yPosition += 7
      
      data.redditPosts.slice(0, 3).forEach((post: any) => {
        checkNewPage(20)
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'bold')
        const titleLines = pdf.splitTextToSize(post.title || 'Untitled', pageWidth - 2 * margin)
        titleLines.forEach((line: string) => {
          pdf.text(line, margin, yPosition)
          yPosition += 5
        })
        
        pdf.setFont(undefined, 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(`r/${post.subreddit || 'unknown'} • Score: ${post.score || 0}`, margin, yPosition)
        yPosition += 8
        pdf.setTextColor(0, 0, 0)
      })
    }
  }
  
  function addResearchSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    const papers = data.papers || []
    if (papers.length === 0) {
      pdf.text('No academic research found.', margin, yPosition)
      yPosition += 10
      return
    }
    
    papers.slice(0, 5).forEach((paper: any) => {
      checkNewPage(30)
      
      // Title
      pdf.setFont(undefined, 'bold')
      const titleLines = pdf.splitTextToSize(paper.title || 'Untitled', pageWidth - 2 * margin)
      titleLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition)
        yPosition += 5
      })
      
      // Authors and year
      pdf.setFont(undefined, 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      const authors = paper.authors?.slice(0, 3).join(', ') || 'Unknown authors'
      pdf.text(`${authors} • ${paper.year || 'Unknown year'}`, margin, yPosition)
      yPosition += 5
      
      // Abstract snippet
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      if (paper.abstract && paper.abstract !== 'No abstract available') {
        const abstractLines = pdf.splitTextToSize(paper.abstract.substring(0, 150) + '...', pageWidth - 2 * margin)
        abstractLines.forEach((line: string) => {
          checkNewPage()
          pdf.text(line, margin, yPosition)
          yPosition += 5
        })
      }
      
      // DOI
      if (paper.doi) {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`DOI: ${paper.doi}`, margin, yPosition)
        yPosition += 5
      }
      
      yPosition += 5
      pdf.setTextColor(0, 0, 0)
    })
  }
  
  function addPatentsSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    const totalPatents = data.totalPatents || data.patents?.length || 0
    
    if (totalPatents > 0) {
      pdf.setFontSize(12)
      pdf.setTextColor(0, 102, 204)
      pdf.text(`Total Patents Found: ${totalPatents}`, margin, yPosition)
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
    }
    
    const patents = data.patents || []
    if (patents.length === 0) {
      pdf.text('No patent data available.', margin, yPosition)
      yPosition += 10
      return
    }
    
    patents.slice(0, 5).forEach((patent: any) => {
      checkNewPage(25)
      
      pdf.setFont(undefined, 'bold')
      const titleLines = pdf.splitTextToSize(patent.title || 'Untitled Patent', pageWidth - 2 * margin)
      titleLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition)
        yPosition += 5
      })
      
      pdf.setFont(undefined, 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Patent #${patent.patentNumber || 'Unknown'} • ${patent.date || 'Unknown date'}`, margin, yPosition)
      yPosition += 5
      pdf.text(`Inventor: ${patent.inventor || 'Unknown'} • Assignee: ${patent.assignee || 'Unknown'}`, margin, yPosition)
      yPosition += 5
      
      if (patent.abstract) {
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        const abstractLines = pdf.splitTextToSize(patent.abstract.substring(0, 100) + '...', pageWidth - 2 * margin)
        abstractLines.forEach((line: string) => {
          checkNewPage()
          pdf.text(line, margin, yPosition)
          yPosition += 5
        })
      }
      
      yPosition += 5
      pdf.setTextColor(0, 0, 0)
    })
  }
  
  function addEconomicSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    const indicators = data.indicators || []
    
    if (indicators.length === 0) {
      pdf.text('No economic data available.', margin, yPosition)
      yPosition += 10
      return
    }
    
    indicators.forEach((indicator: any) => {
      checkNewPage()
      pdf.setFont(undefined, 'bold')
      pdf.text(indicator.name || 'Unknown Indicator', margin, yPosition)
      yPosition += 5
      
      pdf.setFont(undefined, 'normal')
      const value = `${indicator.value || 'N/A'} ${indicator.unit || ''}`
      const change = indicator.change ? ` (${indicator.change > 0 ? '+' : ''}${indicator.change}%)` : ''
      pdf.text(`${value}${change}`, margin, yPosition)
      yPosition += 5
      
      if (indicator.date) {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`As of: ${indicator.date}`, margin, yPosition)
        yPosition += 5
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(11)
      }
      
      yPosition += 3
    })
  }
  
  function addFinancialSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    if (!data || Object.keys(data).length === 0) {
      pdf.text('No financial data available.', margin, yPosition)
      yPosition += 10
      return
    }
    
    // Add any financial metrics
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        checkNewPage()
        pdf.setFont(undefined, 'bold')
        pdf.text(key.charAt(0).toUpperCase() + key.slice(1), margin, yPosition)
        yPosition += 5
        pdf.setFont(undefined, 'normal')
        
        Object.entries(value).forEach(([subKey, subValue]) => {
          pdf.text(`${subKey}: ${subValue}`, margin + 5, yPosition)
          yPosition += 5
        })
        yPosition += 3
      }
    })
  }
  
  function addInsightsSection(pdf: jsPDF, data: any, margin: number, pageWidth: number) {
    // Opportunities
    if (data.opportunities?.length > 0) {
      pdf.setFontSize(12)
      pdf.setTextColor(0, 153, 0)
      pdf.text('Opportunities', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      data.opportunities.forEach((opp: string) => {
        checkNewPage()
        const lines = pdf.splitTextToSize(`• ${opp}`, pageWidth - 2 * margin - 5)
        lines.forEach((line: string) => {
          pdf.text(line, margin + 5, yPosition)
          yPosition += 5
        })
      })
      yPosition += 5
    }
    
    // Risks
    if (data.risks?.length > 0) {
      checkNewPage()
      pdf.setFontSize(12)
      pdf.setTextColor(204, 0, 0)
      pdf.text('Risks & Challenges', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      data.risks.forEach((risk: string) => {
        checkNewPage()
        const lines = pdf.splitTextToSize(`• ${risk}`, pageWidth - 2 * margin - 5)
        lines.forEach((line: string) => {
          pdf.text(line, margin + 5, yPosition)
          yPosition += 5
        })
      })
      yPosition += 5
    }
    
    // Recommendations
    if (data.recommendations?.length > 0) {
      checkNewPage()
      pdf.setFontSize(12)
      pdf.setTextColor(0, 102, 204)
      pdf.text('Recommendations', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      data.recommendations.forEach((rec: string) => {
        checkNewPage()
        const lines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 2 * margin - 5)
        lines.forEach((line: string) => {
          pdf.text(line, margin + 5, yPosition)
          yPosition += 5
        })
      })
      yPosition += 5
    }
    
    // Future Outlook
    if (data.futureOutlook) {
      checkNewPage()
      pdf.setFontSize(12)
      pdf.text('Future Outlook', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(10)
      const outlookLines = pdf.splitTextToSize(data.futureOutlook, pageWidth - 2 * margin)
      outlookLines.forEach((line: string) => {
        checkNewPage()
        pdf.text(line, margin, yPosition)
        yPosition += 5
      })
    }
  }
}
