import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ReportData } from '@/types'

export async function generatePDF(data: ReportData) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin
  
  // Title
  pdf.setFontSize(24)
  pdf.setTextColor(0, 0, 0)
  pdf.text(data.query, margin, yPosition)
  yPosition += 15
  
  // Metadata
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Generated on ${new Date(data.timestamp).toLocaleString()}`, margin, yPosition)
  yPosition += 10
  
  // Summary
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  const summaryLines = pdf.splitTextToSize(data.summary, pageWidth - 2 * margin)
  pdf.text(summaryLines, margin, yPosition)
  yPosition += summaryLines.length * 5 + 10
  
  // Sections
  data.sections.forEach(section => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = margin
    }
    
    pdf.setFontSize(16)
    pdf.setTextColor(0, 102, 204)
    pdf.text(section.title, margin, yPosition)
    yPosition += 10
    
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    // Add section content based on type
    const content = formatSectionContent(section)
    const lines = pdf.splitTextToSize(content, pageWidth - 2 * margin)
    
    lines.forEach(line => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(line, margin, yPosition)
      yPosition += 5
    })
    
    yPosition += 10
  })
  
  // Save the PDF
  pdf.save(`${data.query.replace(/[^a-z0-9]/gi, '_')}_report.pdf`)
}

function formatSectionContent(section: any): string {
  switch (section.type) {
    case 'trends':
      let content = ''
      if (section.data.relatedQueries) {
        content += `Related Searches: ${section.data.relatedQueries.join(', ')}\n\n`
      }
      if (section.data.geographicDistribution) {
        content += 'Top Locations:\n'
        section.data.geographicDistribution.slice(0, 5).forEach(loc => {
          content += `${loc.location}: ${loc.interest}%\n`
        })
      }
      return content
      
    case 'news':
      return section.data.articles?.slice(0, 5).map(article => 
        `${article.title}\n${article.source} - ${new Date(article.publishedAt).toLocaleDateString()}\n${article.description}\n`
      ).join('\n') || 'No news found.'
      
    case 'insights':
      let insightContent = ''
      if (section.data.opportunities) {
        insightContent += 'Opportunities:\n' + section.data.opportunities.map(o => `• ${o}`).join('\n') + '\n\n'
      }
      if (section.data.risks) {
        insightContent += 'Risks:\n' + section.data.risks.map(r => `• ${r}`).join('\n') + '\n\n'
      }
      if (section.data.recommendations) {
        insightContent += 'Recommendations:\n' + section.data.recommendations.map(r => `• ${r}`).join('\n') + '\n\n'
      }
      if (section.data.futureOutlook) {
        insightContent += `Future Outlook: ${section.data.futureOutlook}`
      }
      return insightContent
      
    case 'research':
      return section.data.papers?.slice(0, 3).map(paper => 
        `${paper.title}\n${paper.authors.join(', ')} (${paper.year})\n${paper.abstract.substring(0, 200)}...\n`
      ).join('\n') || 'No research found.'
      
    case 'patents':
      return section.data.patents?.slice(0, 3).map(patent => 
        `${patent.title}\nPatent #${patent.patentNumber} - ${patent.date}\nInventor: ${patent.inventor}\n`
      ).join('\n') || 'No patents found.'
      
    default:
      return JSON.stringify(section.data, null, 2).substring(0, 500)
  }
}