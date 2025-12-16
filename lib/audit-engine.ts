import axios from 'axios'
import * as cheerio from 'cheerio'
import type { AuditResult, PerformanceMetrics, SEOAudit, TechnicalChecks, Issue } from '@/types/audit'

export class AuditEngine {
  private url: string
  private html: string = ''
  private $: cheerio.CheerioAPI | null = null
  private responseHeaders: Record<string, string> = {}

  constructor(url: string) {
    this.url = url
  }

  async runAudit(): Promise<AuditResult> {
    // Fetch the page
    await this.fetchPage()
    
    // Run all audits in parallel where possible
    const [performance, seo, technical] = await Promise.all([
      this.auditPerformance(),
      this.auditSEO(),
      this.auditTechnical()
    ])

    // Generate issues list
    const issues = this.generateIssues(performance, seo, technical)

    // Calculate overall score
    const overallScore = Math.round(
      (performance.score + seo.score + technical.score) / 3
    )

    return {
      url: this.url,
      date: new Date().toISOString(),
      performance,
      seo,
      technical,
      issues,
      overallScore,
    }
  }

  private async fetchPage() {
    try {
      const response = await axios.get(this.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        maxRedirects: 5,
        timeout: 30000,
      })
      this.html = response.data
      this.$ = cheerio.load(this.html)
      this.responseHeaders = response.headers as Record<string, string>
    } catch (error: any) {
      throw new Error(`Failed to fetch page: ${error.message}`)
    }
  }

  private async auditPerformance(): Promise<PerformanceMetrics> {
    const startTime = Date.now()
    
    // Simulate performance metrics (in production, use Lighthouse or Puppeteer)
    // For now, we'll calculate based on page size and structure
    const pageSize = new Blob([this.html]).size
    const numberOfRequests = this.countResources()
    
    // Estimate metrics based on page characteristics
    const pageLoadTime = Math.max(500, pageSize / 10000) // Rough estimate
    const firstContentfulPaint = pageLoadTime * 0.3
    const largestContentfulPaint = pageLoadTime * 0.6
    const timeToInteractive = pageLoadTime * 0.8
    const totalBlockingTime = Math.max(0, pageLoadTime - 300)
    const cumulativeLayoutShift = this.estimateCLS()

    // Calculate score (0-100)
    let score = 100
    if (pageLoadTime > 3000) score -= 30
    else if (pageLoadTime > 2000) score -= 20
    else if (pageLoadTime > 1000) score -= 10

    if (largestContentfulPaint > 2500) score -= 20
    else if (largestContentfulPaint > 1500) score -= 10

    if (cumulativeLayoutShift > 0.25) score -= 20
    else if (cumulativeLayoutShift > 0.1) score -= 10

    if (pageSize > 5000000) score -= 15
    else if (pageSize > 2000000) score -= 10

    if (numberOfRequests > 100) score -= 10
    else if (numberOfRequests > 50) score -= 5

    score = Math.max(0, Math.min(100, score))

    return {
      pageLoadTime: Math.round(pageLoadTime),
      firstContentfulPaint: Math.round(firstContentfulPaint),
      largestContentfulPaint: Math.round(largestContentfulPaint),
      timeToInteractive: Math.round(timeToInteractive),
      totalBlockingTime: Math.round(totalBlockingTime),
      cumulativeLayoutShift: Math.round(cumulativeLayoutShift * 100) / 100,
      pageSize,
      numberOfRequests,
      score,
    }
  }

  private countResources(): number {
    if (!this.$) return 0
    
    const scripts = this.$('script[src]').length
    const stylesheets = this.$('link[rel="stylesheet"]').length
    const images = this.$('img[src]').length
    const fonts = this.$('link[rel*="font"]').length
    
    return scripts + stylesheets + images + fonts + 1 // +1 for HTML
  }

  private estimateCLS(): number {
    // Simplified CLS estimation based on image loading
    if (!this.$) return 0
    
    const imagesWithoutDimensions = this.$('img:not([width]):not([height])').length
    const totalImages = this.$('img').length
    
    if (totalImages === 0) return 0
    
    // Rough estimate: more images without dimensions = higher CLS
    return Math.min(0.5, (imagesWithoutDimensions / totalImages) * 0.3)
  }

  private auditSEO(): Promise<SEOAudit> {
    if (!this.$) {
      throw new Error('Page not loaded')
    }

    // Title tag
    const titleTag = this.$('title').first()
    const titleExists = titleTag.length > 0
    const titleContent = titleTag.text().trim()
    const titleLength = titleContent.length
    let titleScore = 100
    if (!titleExists) titleScore = 0
    else if (titleLength < 30) titleScore = 50
    else if (titleLength > 60) titleScore = 70

    // Meta description
    const metaDesc = this.$('meta[name="description"]').attr('content') || ''
    const metaDescExists = metaDesc.length > 0
    const metaDescLength = metaDesc.length

    // Headings
    const headings = {
      h1: this.$('h1').length,
      h2: this.$('h2').length,
      h3: this.$('h3').length,
      h4: this.$('h4').length,
      h5: this.$('h5').length,
      h6: this.$('h6').length,
    }

    // Images
    const $ = this.$
    const images = $('img')
    const totalImages = images.length
    let withAlt = 0
    images.each((_, el) => {
      const alt = $(el).attr('alt')
      if (alt !== undefined && alt !== '') withAlt++
    })

    // Links
    const allLinks = this.$('a[href]')
    let internal = 0
    let external = 0
    const baseUrl = new URL(this.url)
    
    allLinks.each((_, el) => {
      const href = this.$(el).attr('href')
      if (!href) return
      
      try {
        const linkUrl = new URL(href, this.url)
        if (linkUrl.hostname === baseUrl.hostname) {
          internal++
        } else {
          external++
        }
      } catch {
        // Relative link, count as internal
        internal++
      }
    })

    // Canonical
    const canonical = this.$('link[rel="canonical"]')
    const canonicalExists = canonical.length > 0
    const canonicalUrl = canonicalExists ? canonical.attr('href') || null : null

    // Robots meta
    const robotsMeta = this.$('meta[name="robots"]')
    const robotsMetaExists = robotsMeta.length > 0
    const robotsContent = robotsMetaExists ? robotsMeta.attr('content') || null : null

    // Sitemap (check common locations)
    const sitemapLink = this.$('link[rel="sitemap"]')
    const sitemapExists = sitemapLink.length > 0
    const sitemapUrl = sitemapExists ? sitemapLink.attr('href') || null : null

    // Robots.txt (will be checked separately)
    const robotsTxtExists = false // Will be checked via API
    const robotsTxtStatus = null

    // Calculate SEO score
    let seoScore = 100
    if (!titleExists) seoScore -= 25
    if (titleLength < 30 || titleLength > 60) seoScore -= 10
    if (!metaDescExists) seoScore -= 15
    if (metaDescLength < 120 || metaDescLength > 160) seoScore -= 5
    if (headings.h1 === 0) seoScore -= 15
    if (headings.h1 > 1) seoScore -= 10
    const missingAlt = totalImages - withAlt
    if (missingAlt > 0) seoScore -= Math.min(15, (missingAlt / totalImages) * 15)
    if (!canonicalExists) seoScore -= 5
    if (!sitemapExists) seoScore -= 5

    seoScore = Math.max(0, Math.min(100, seoScore))

    return Promise.resolve({
      title: {
        exists: titleExists,
        content: titleContent,
        length: titleLength,
        score: titleScore,
      },
      metaDescription: {
        exists: metaDescExists,
        content: metaDesc,
        length: metaDescLength,
      },
      headings,
      images: {
        total: totalImages,
        withAlt,
        withoutAlt: totalImages - withAlt,
      },
      links: {
        internal,
        external,
        broken: 0, // Will be checked separately
      },
      canonical: {
        exists: canonicalExists,
        url: canonicalUrl,
      },
      robotsMeta: {
        exists: robotsMetaExists,
        content: robotsContent,
      },
      sitemap: {
        exists: sitemapExists,
        url: sitemapUrl,
      },
      robotsTxt: {
        exists: robotsTxtExists,
        status: robotsTxtStatus,
      },
      score: seoScore,
    })
  }

  private async auditTechnical(): Promise<TechnicalChecks> {
    const urlObj = new URL(this.url)
    const https = urlObj.protocol === 'https:'
    
    // Mobile friendliness (simplified check)
    const viewport = this.$?.('meta[name="viewport"]').length || 0
    const mobileFriendly = viewport > 0

    // Core Web Vitals (simplified)
    const performance = await this.auditPerformance()
    const lcp = performance.largestContentfulPaint < 2500 ? 'good' : 
                performance.largestContentfulPaint < 4000 ? 'needs-improvement' : 'poor'
    const cls = performance.cumulativeLayoutShift < 0.1 ? 'good' :
                performance.cumulativeLayoutShift < 0.25 ? 'needs-improvement' : 'poor'
    const fid = 'good' // Simplified, would need real user metrics

    // Compression
    const contentEncoding = this.responseHeaders['content-encoding'] || ''
    const gzip = contentEncoding.includes('gzip')
    const brotli = contentEncoding.includes('br')

    // Caching
    const cacheControl = this.responseHeaders['cache-control'] || ''
    const cachingEnabled = cacheControl.length > 0
    let maxAge: number | null = null
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/)
    if (maxAgeMatch) {
      maxAge = parseInt(maxAgeMatch[1])
    }

    // CDN detection
    const server = this.responseHeaders['server'] || ''
    const cdnHeaders = ['cloudflare', 'cloudfront', 'fastly', 'akamai', 'maxcdn']
    let cdnDetected = false
    let cdnProvider: string | null = null
    
    for (const cdn of cdnHeaders) {
      if (server.toLowerCase().includes(cdn)) {
        cdnDetected = true
        cdnProvider = cdn
        break
      }
    }

    // Check for CDN in headers
    if (!cdnDetected) {
      const cdnHeaders = ['cf-ray', 'x-amz-cf-id', 'x-cache', 'x-served-by']
      for (const header of cdnHeaders) {
        if (this.responseHeaders[header.toLowerCase()]) {
          cdnDetected = true
          cdnProvider = 'unknown'
          break
        }
      }
    }

    // Calculate technical score
    let techScore = 100
    if (!https) techScore -= 30
    if (!mobileFriendly) techScore -= 20
    if (lcp !== 'good') techScore -= 15
    if (cls !== 'good') techScore -= 10
    if (!gzip && !brotli) techScore -= 10
    if (!cachingEnabled) techScore -= 5

    techScore = Math.max(0, Math.min(100, techScore))

    return {
      https,
      mobileFriendly,
      coreWebVitals: {
        lcp,
        fid,
        cls,
      },
      redirects: {
        count: 0, // Simplified
        chain: [],
      },
      serverResponseTime: performance.pageLoadTime,
      compression: {
        gzip,
        brotli,
      },
      caching: {
        enabled: cachingEnabled,
        maxAge,
      },
      cdn: {
        detected: cdnDetected,
        provider: cdnProvider,
      },
      score: techScore,
    }
  }

  private generateIssues(
    performance: PerformanceMetrics,
    seo: SEOAudit,
    technical: TechnicalChecks
  ): Issue[] {
    const issues: Issue[] = []

    // Performance issues
    if (performance.largestContentfulPaint > 2500) {
      issues.push({
        category: 'performance',
        problem: 'Largest Contentful Paint (LCP) is too slow',
        impact: performance.largestContentfulPaint > 4000 ? 'high' : 'medium',
        fix: 'Optimize images, use CDN, implement lazy loading, and reduce server response time',
      })
    }

    if (performance.cumulativeLayoutShift > 0.1) {
      issues.push({
        category: 'performance',
        problem: 'Cumulative Layout Shift (CLS) is too high',
        impact: performance.cumulativeLayoutShift > 0.25 ? 'high' : 'medium',
        fix: 'Add width and height attributes to images, avoid inserting content above existing content',
      })
    }

    if (performance.pageSize > 2000000) {
      issues.push({
        category: 'performance',
        problem: 'Page size is too large',
        impact: 'medium',
        fix: 'Compress images, minify CSS/JS, remove unused code, and enable compression',
      })
    }

    if (performance.numberOfRequests > 50) {
      issues.push({
        category: 'performance',
        problem: 'Too many HTTP requests',
        impact: 'medium',
        fix: 'Combine CSS/JS files, use sprites for images, and implement resource bundling',
      })
    }

    // SEO issues
    if (!seo.title.exists) {
      issues.push({
        category: 'seo',
        problem: 'Missing title tag',
        impact: 'high',
        fix: 'Add a descriptive title tag between 30-60 characters',
      })
    } else if (seo.title.length < 30 || seo.title.length > 60) {
      issues.push({
        category: 'seo',
        problem: `Title tag length is ${seo.title.length} characters (should be 30-60)`,
        impact: 'medium',
        fix: 'Optimize title tag to be between 30-60 characters for best SEO results',
      })
    }

    if (!seo.metaDescription.exists) {
      issues.push({
        category: 'seo',
        problem: 'Missing meta description',
        impact: 'high',
        fix: 'Add a compelling meta description between 120-160 characters',
      })
    }

    if (seo.headings.h1 === 0) {
      issues.push({
        category: 'seo',
        problem: 'No H1 heading found',
        impact: 'high',
        fix: 'Add a single H1 heading that describes the main content of the page',
      })
    } else if (seo.headings.h1 > 1) {
      issues.push({
        category: 'seo',
        problem: 'Multiple H1 headings found',
        impact: 'medium',
        fix: 'Use only one H1 heading per page for better SEO structure',
      })
    }

    if (seo.images.withoutAlt > 0) {
      issues.push({
        category: 'seo',
        problem: `${seo.images.withoutAlt} images missing alt text`,
        impact: seo.images.withoutAlt > seo.images.total * 0.5 ? 'high' : 'medium',
        fix: 'Add descriptive alt text to all images for accessibility and SEO',
      })
    }

    if (!seo.canonical.exists) {
      issues.push({
        category: 'seo',
        problem: 'Missing canonical tag',
        impact: 'low',
        fix: 'Add a canonical tag to prevent duplicate content issues',
      })
    }

    // Technical issues
    if (!technical.https) {
      issues.push({
        category: 'technical',
        problem: 'Site is not using HTTPS',
        impact: 'high',
        fix: 'Implement SSL/TLS certificate and redirect HTTP to HTTPS',
      })
    }

    if (!technical.mobileFriendly) {
      issues.push({
        category: 'technical',
        problem: 'Missing viewport meta tag for mobile',
        impact: 'high',
        fix: 'Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">',
      })
    }

    if (!technical.compression.gzip && !technical.compression.brotli) {
      issues.push({
        category: 'technical',
        problem: 'Compression not enabled',
        impact: 'medium',
        fix: 'Enable Gzip or Brotli compression on your server to reduce page size',
      })
    }

    if (!technical.caching.enabled) {
      issues.push({
        category: 'technical',
        problem: 'Browser caching not configured',
        impact: 'medium',
        fix: 'Configure Cache-Control headers to enable browser caching for static assets',
      })
    }

    return issues
  }
}

