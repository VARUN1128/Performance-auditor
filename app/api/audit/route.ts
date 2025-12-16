import { NextRequest, NextResponse } from 'next/server'
import { AuditEngine } from '@/lib/audit-engine'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Ensure URL has protocol
    let auditUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      auditUrl = `https://${url}`
    }

    // Run audit
    const engine = new AuditEngine(auditUrl)
    const result = await engine.runAudit()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Audit error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to run audit' },
      { status: 500 }
    )
  }
}

