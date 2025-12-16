import jsPDF from 'jspdf'
import type { AuditResult } from '@/types/audit'

const COMPANY_NAME = 'Legacy Incorp._G Business Support'
const REPORT_TITLE = 'Website SEO & Performance Audit Report'

// Helper function to load image as base64
async function loadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        resolve(base64String)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading logo:', error)
    return ''
  }
}

export async function generatePDF(result: AuditResult): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Load logo image
  const logoBase64 = await loadImageAsBase64('/legacy-logo.jpg')

  // Helper function to add header
  const addHeader = () => {
    // Add logo if loaded successfully
    if (logoBase64) {
      try {
        // Calculate logo dimensions (30mm width, maintain aspect ratio)
        const logoWidth = 30
        const logoHeight = 15
        doc.addImage(logoBase64, 'JPEG', margin, margin, logoWidth, logoHeight)
      } catch (error) {
        console.error('Error adding logo to PDF:', error)
        // Fallback to placeholder if image fails
        doc.setFillColor(240, 240, 240)
        doc.rect(margin, margin, 30, 15, 'F')
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('[LOGO]', margin + 15, margin + 8, { align: 'center' })
      }
    } else {
      // Fallback placeholder if logo failed to load
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, margin, 30, 15, 'F')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('[LOGO]', margin + 15, margin + 8, { align: 'center' })
    }

    // Company name
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(COMPANY_NAME, margin + 35, margin + 8)

    // Report title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(REPORT_TITLE, margin, margin + 25)

    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

    return margin + 35
  }

  // Initialize header on first page
  yPosition = addHeader()

  // Helper function to add footer
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 15
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, footerY, pageWidth - margin, footerY)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      pageWidth / 2,
      footerY + 8,
      { align: 'center' }
    )
  }

  // Helper function to check if new page needed
  const checkNewPage = async (requiredSpace: number): Promise<number> => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      addFooter(doc.getNumberOfPages(), doc.getNumberOfPages() + 1)
      doc.addPage()
      yPosition = addHeader()
      return yPosition
    }
    return yPosition
  }

  // Helper function to add section
  const addSection = async (title: string, content: () => Promise<void>) => {
    yPosition = await checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(title, margin, yPosition)
    yPosition += 8
    await content()
    yPosition += 5
  }

  // Helper function to add metric row
  const addMetricRow = async (label: string, value: string, indent: number = 0) => {
    yPosition = await checkNewPage(7)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(label, margin + indent, yPosition)
    doc.setFont('helvetica', 'bold')
    doc.text(value, pageWidth - margin - 50, yPosition, { align: 'right' })
    yPosition += 6
  }

  // Helper function to add score bar
  const addScoreBar = async (label: string, score: number, x: number, y: number, width: number) => {
    const barHeight = 8
    const barWidth = width
    const scoreWidth = (score / 100) * barWidth
    
    // Background bar
    doc.setFillColor(230, 230, 230)
    doc.rect(x, y, barWidth, barHeight, 'F')
    
    // Score bar with color based on score
    if (score >= 80) {
      doc.setFillColor(16, 185, 129) // green
    } else if (score >= 60) {
      doc.setFillColor(245, 158, 11) // yellow
    } else {
      doc.setFillColor(239, 68, 68) // red
    }
    doc.rect(x, y, scoreWidth, barHeight, 'F')
    
    // Label and score text
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(label, x, y - 2)
    doc.text(`${score}/100`, x + barWidth - 15, y - 2, { align: 'right' })
    
    return y + barHeight + 5
  }

  // Helper function to add insights box
  const addInsightsBox = async (title: string, insights: string[]) => {
    yPosition = await checkNewPage(insights.length * 6 + 15)
    
    // Box background
    doc.setFillColor(240, 248, 255)
    doc.setDrawColor(59, 130, 246)
    doc.rect(margin, yPosition - 5, contentWidth, insights.length * 6 + 10, 'FD')
    
    // Title
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 64, 175)
    doc.text(title, margin + 3, yPosition)
    yPosition += 6
    
    // Insights
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    for (const insight of insights) {
      doc.text(`• ${insight}`, margin + 5, yPosition)
      yPosition += 5
    }
    yPosition += 3
    return yPosition
  }

  // Executive Summary
  await addSection('Executive Summary', async () => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    yPosition = await checkNewPage(10)
    doc.text(`Website URL: ${result.url}`, margin, yPosition)
    yPosition += 5
    doc.text(`Audit Date: ${new Date(result.date).toLocaleDateString()}`, margin, yPosition)
    yPosition += 8

    // Score bars
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Score Overview', margin, yPosition)
    yPosition += 8
    
    yPosition = await addScoreBar('Overall Score', result.overallScore, margin, yPosition, contentWidth)
    yPosition = await addScoreBar('Performance', result.performance.score, margin, yPosition, contentWidth)
    yPosition = await addScoreBar('SEO', result.seo.score, margin, yPosition, contentWidth)
    yPosition = await addScoreBar('Technical', result.technical.score, margin, yPosition, contentWidth)
    yPosition += 5

    // Issues summary
    yPosition = await checkNewPage(10)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Issues Summary', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Issues Found: ${result.issues.length}`, margin, yPosition)
    yPosition += 5
    doc.setTextColor(200, 0, 0)
    doc.text(`High Priority: ${result.issues.filter(i => i.impact === 'high').length}`, margin, yPosition)
    yPosition += 5
    doc.setTextColor(245, 158, 11)
    doc.text(`Medium Priority: ${result.issues.filter(i => i.impact === 'medium').length}`, margin, yPosition)
    yPosition += 5
    doc.setTextColor(100, 100, 100)
    doc.text(`Low Priority: ${result.issues.filter(i => i.impact === 'low').length}`, margin, yPosition)
    doc.setTextColor(0, 0, 0)
    yPosition += 8

    // Key Insights
    const insights: string[] = []
    if (result.overallScore >= 80) {
      insights.push('Website performance is excellent overall')
    } else if (result.overallScore >= 60) {
      insights.push('Website has good performance with room for improvement')
    } else {
      insights.push('Website requires significant optimization')
    }
    
    if (result.performance.score < 60) {
      insights.push('Performance metrics need immediate attention')
    }
    if (result.seo.score < 60) {
      insights.push('SEO elements require optimization')
    }
    if (result.technical.score < 60) {
      insights.push('Technical infrastructure needs improvement')
    }
    
    if (result.issues.filter(i => i.impact === 'high').length > 0) {
      insights.push(`${result.issues.filter(i => i.impact === 'high').length} high-priority issues need urgent attention`)
    }

    if (insights.length > 0) {
      yPosition = await addInsightsBox('Key Insights', insights)
    }
  })

  // Performance Metrics
  await addSection('Performance Metrics', async () => {
    await addMetricRow('Page Load Time', `${result.performance.pageLoadTime} ms`)
    const pageLoadStatus = result.performance.pageLoadTime <= 1000 ? 'Excellent' : result.performance.pageLoadTime <= 3000 ? 'Good' : 'Needs Improvement'
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`  Status: ${pageLoadStatus}`, margin + 5, yPosition - 3)
    yPosition += 2

    await addMetricRow('First Contentful Paint (FCP)', `${result.performance.firstContentfulPaint} ms`)
    await addMetricRow('Largest Contentful Paint (LCP)', `${result.performance.largestContentfulPaint} ms`)
    await addMetricRow('Time to Interactive (TTI)', `${result.performance.timeToInteractive} ms`)
    await addMetricRow('Total Blocking Time (TBT)', `${result.performance.totalBlockingTime} ms`)
    await addMetricRow('Cumulative Layout Shift (CLS)', result.performance.cumulativeLayoutShift.toFixed(2))
    await addMetricRow('Page Size', formatBytes(result.performance.pageSize))
    await addMetricRow('Number of Requests', result.performance.numberOfRequests.toString())
    
    yPosition += 3
    yPosition = await addScoreBar('Performance Score', result.performance.score, margin, yPosition, contentWidth)
    
    // Performance insights
    const perfInsights: string[] = []
    if (result.performance.pageLoadTime > 3000) {
      perfInsights.push('Page load time exceeds 3 seconds - consider optimizing assets and reducing server response time')
    }
    if (result.performance.pageSize > 2 * 1024 * 1024) {
      perfInsights.push('Page size is large - consider image optimization and code minification')
    }
    if (result.performance.numberOfRequests > 50) {
      perfInsights.push('High number of requests - consider bundling resources and reducing HTTP requests')
    }
    if (result.performance.cumulativeLayoutShift > 0.25) {
      perfInsights.push('Layout shift is high - ensure images and ads have defined dimensions')
    }
    
    if (perfInsights.length > 0) {
      yPosition = await addInsightsBox('Performance Recommendations', perfInsights)
    }
  })

  // SEO Audit
  await addSection('SEO Audit', async () => {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Title Tag', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (result.seo.title.exists) {
      await addMetricRow('  Exists', 'Yes', 5)
      await addMetricRow('  Content', result.seo.title.content.substring(0, 60) + (result.seo.title.content.length > 60 ? '...' : ''), 5)
      await addMetricRow('  Length', `${result.seo.title.length} characters`, 5)
    } else {
      await addMetricRow('  Exists', 'No', 5)
    }
    yPosition += 3

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Meta Description', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (result.seo.metaDescription.exists) {
      await addMetricRow('  Exists', 'Yes', 5)
      await addMetricRow('  Length', `${result.seo.metaDescription.length} characters`, 5)
    } else {
      await addMetricRow('  Exists', 'No', 5)
    }
    yPosition += 3

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Headings Structure', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    await addMetricRow('  H1', result.seo.headings.h1.toString(), 5)
    await addMetricRow('  H2', result.seo.headings.h2.toString(), 5)
    await addMetricRow('  H3', result.seo.headings.h3.toString(), 5)
    await addMetricRow('  H4', result.seo.headings.h4.toString(), 5)
    await addMetricRow('  H5', result.seo.headings.h5.toString(), 5)
    await addMetricRow('  H6', result.seo.headings.h6.toString(), 5)
    yPosition += 3

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Images', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    await addMetricRow('  Total Images', result.seo.images.total.toString(), 5)
    await addMetricRow('  With Alt Text', result.seo.images.withAlt.toString(), 5)
    await addMetricRow('  Missing Alt Text', result.seo.images.withoutAlt.toString(), 5)
    yPosition += 3

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Links', margin, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    await addMetricRow('  Internal Links', result.seo.links.internal.toString(), 5)
    await addMetricRow('  External Links', result.seo.links.external.toString(), 5)
    await addMetricRow('  Broken Links', result.seo.links.broken.toString(), 5)
    yPosition += 3

    yPosition += 3
    yPosition = await addScoreBar('SEO Score', result.seo.score, margin, yPosition, contentWidth)
    
    // SEO insights
    const seoInsights: string[] = []
    if (!result.seo.title.exists) {
      seoInsights.push('Missing title tag - critical for SEO and search engine visibility')
    } else if (result.seo.title.length < 30 || result.seo.title.length > 60) {
      seoInsights.push('Title tag length is not optimal - recommended 30-60 characters')
    }
    if (!result.seo.metaDescription.exists) {
      seoInsights.push('Missing meta description - important for search result snippets')
    } else if (result.seo.metaDescription.length < 120 || result.seo.metaDescription.length > 160) {
      seoInsights.push('Meta description length should be 120-160 characters for best results')
    }
    if (result.seo.headings.h1 === 0) {
      seoInsights.push('No H1 heading found - each page should have exactly one H1 tag')
    } else if (result.seo.headings.h1 > 1) {
      seoInsights.push('Multiple H1 headings found - use only one H1 per page for better SEO')
    }
    if (result.seo.images.withoutAlt > 0) {
      seoInsights.push(`${result.seo.images.withoutAlt} images missing alt text - add descriptive alt attributes`)
    }
    if (result.seo.links.broken > 0) {
      seoInsights.push(`${result.seo.links.broken} broken links detected - fix or remove broken links`)
    }
    if (!result.seo.sitemap.exists) {
      seoInsights.push('Sitemap not found - create and submit XML sitemap to search engines')
    }
    
    if (seoInsights.length > 0) {
      yPosition = await addInsightsBox('SEO Recommendations', seoInsights)
    }
  })

  // Technical Checks
  await addSection('Technical Checks', async () => {
    await addMetricRow('HTTPS Enabled', result.technical.https ? 'Yes' : 'No')
    await addMetricRow('Mobile Friendly', result.technical.mobileFriendly ? 'Yes' : 'No')
    await addMetricRow('LCP Status', result.technical.coreWebVitals.lcp.toUpperCase())
    await addMetricRow('FID Status', result.technical.coreWebVitals.fid.toUpperCase())
    await addMetricRow('CLS Status', result.technical.coreWebVitals.cls.toUpperCase())
    await addMetricRow('Server Response Time', `${result.technical.serverResponseTime} ms`)
    await addMetricRow('Gzip Compression', result.technical.compression.gzip ? 'Yes' : 'No')
    await addMetricRow('Brotli Compression', result.technical.compression.brotli ? 'Yes' : 'No')
    await addMetricRow('Browser Caching', result.technical.caching.enabled ? 'Yes' : 'No')
    if (result.technical.caching.maxAge) {
      await addMetricRow('  Max Age', `${result.technical.caching.maxAge} seconds`, 5)
    }
    await addMetricRow('CDN Detected', result.technical.cdn.detected ? 'Yes' : 'No')
    if (result.technical.cdn.provider) {
      await addMetricRow('  CDN Provider', result.technical.cdn.provider, 5)
    }
    yPosition += 3
    yPosition = await addScoreBar('Technical Score', result.technical.score, margin, yPosition, contentWidth)
    
    // Technical insights
    const techInsights: string[] = []
    if (!result.technical.https) {
      techInsights.push('HTTPS not enabled - critical for security and SEO ranking')
    }
    if (!result.technical.mobileFriendly) {
      techInsights.push('Website is not mobile-friendly - optimize for mobile devices')
    }
    if (result.technical.serverResponseTime > 500) {
      techInsights.push('Server response time is high - optimize server performance and consider CDN')
    }
    if (!result.technical.compression.gzip && !result.technical.compression.brotli) {
      techInsights.push('No compression enabled - enable Gzip or Brotli compression to reduce file sizes')
    }
    if (!result.technical.caching.enabled) {
      techInsights.push('Browser caching not enabled - configure cache headers to improve performance')
    }
    if (!result.technical.cdn.detected) {
      techInsights.push('CDN not detected - consider using a CDN for faster global content delivery')
    }
    if (result.technical.coreWebVitals.lcp === 'poor') {
      techInsights.push('LCP (Largest Contentful Paint) is poor - optimize images and reduce render-blocking resources')
    }
    if (result.technical.coreWebVitals.cls === 'poor') {
      techInsights.push('CLS (Cumulative Layout Shift) is poor - ensure stable page layout during load')
    }
    
    if (techInsights.length > 0) {
      yPosition = await addInsightsBox('Technical Recommendations', techInsights)
    }
  })

  // Actionable Fixes
  if (result.issues.length > 0) {
    await addSection('Actionable Fixes', async () => {
      const groupedIssues = {
        high: result.issues.filter(i => i.impact === 'high'),
        medium: result.issues.filter(i => i.impact === 'medium'),
        low: result.issues.filter(i => i.impact === 'low'),
      }

      const renderIssues = async (issues: typeof result.issues, priority: string) => {
        if (issues.length === 0) return

        yPosition = await checkNewPage(10)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(priority === 'high' ? 200 : priority === 'medium' ? 150 : 100, 0, 0)
        doc.text(`${priority.toUpperCase()} Priority (${issues.length})`, margin, yPosition)
        yPosition += 6

        for (const issue of issues) {
          yPosition = await checkNewPage(15)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(0, 0, 0)
          doc.text(`• ${issue.problem}`, margin + 5, yPosition)
          yPosition += 5

          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(50, 50, 50)
          const fixLines = doc.splitTextToSize(`Fix: ${issue.fix}`, contentWidth - 10)
          for (const line of fixLines) {
            yPosition = await checkNewPage(5)
            doc.text(line, margin + 10, yPosition)
            yPosition += 4
          }
          yPosition += 2
        }
      }

      await renderIssues(groupedIssues.high, 'high')
      await renderIssues(groupedIssues.medium, 'medium')
      await renderIssues(groupedIssues.low, 'low')
    })
  }

  // Add footer to last page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter(i, totalPages)
  }

  // Save PDF
  const fileName = `SEO-Audit-${result.url.replace(/https?:\/\//, '').replace(/\//g, '-')}-${Date.now()}.pdf`
  doc.save(fileName)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

