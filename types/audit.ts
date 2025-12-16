export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  timeToInteractive: number
  totalBlockingTime: number
  cumulativeLayoutShift: number
  pageSize: number
  numberOfRequests: number
  score: number
}

export interface SEOAudit {
  title: {
    exists: boolean
    content: string
    length: number
    score: number
  }
  metaDescription: {
    exists: boolean
    content: string
    length: number
  }
  headings: {
    h1: number
    h2: number
    h3: number
    h4: number
    h5: number
    h6: number
  }
  images: {
    total: number
    withAlt: number
    withoutAlt: number
  }
  links: {
    internal: number
    external: number
    broken: number
  }
  canonical: {
    exists: boolean
    url: string | null
  }
  robotsMeta: {
    exists: boolean
    content: string | null
  }
  sitemap: {
    exists: boolean
    url: string | null
  }
  robotsTxt: {
    exists: boolean
    status: number | null
  }
  score: number
}

export interface TechnicalChecks {
  https: boolean
  mobileFriendly: boolean
  coreWebVitals: {
    lcp: 'good' | 'needs-improvement' | 'poor'
    fid: 'good' | 'needs-improvement' | 'poor'
    cls: 'good' | 'needs-improvement' | 'poor'
  }
  redirects: {
    count: number
    chain: string[]
  }
  serverResponseTime: number
  compression: {
    gzip: boolean
    brotli: boolean
  }
  caching: {
    enabled: boolean
    maxAge: number | null
  }
  cdn: {
    detected: boolean
    provider: string | null
  }
  score: number
}

export interface Issue {
  category: 'performance' | 'seo' | 'technical'
  problem: string
  impact: 'low' | 'medium' | 'high'
  fix: string
}

export interface AuditResult {
  url: string
  date: string
  performance: PerformanceMetrics
  seo: SEOAudit
  technical: TechnicalChecks
  issues: Issue[]
  overallScore: number
}

