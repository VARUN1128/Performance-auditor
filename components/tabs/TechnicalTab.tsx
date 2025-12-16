'use client'

import type { TechnicalChecks } from '@/types/audit'

interface TechnicalTabProps {
  data: TechnicalChecks
}

function StatusBadge({ status }: { status: boolean | string }) {
  if (typeof status === 'boolean') {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {status ? 'Yes' : 'No'}
      </span>
    )
  }
  
  const getColor = (value: string) => {
    if (value === 'good') return 'bg-green-100 text-green-700'
    if (value === 'needs-improvement') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColor(status)}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  )
}

export default function TechnicalTab({ data }: TechnicalTabProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Checks</h3>
      
      <div className="space-y-6">
        {/* Security */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Security</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">HTTPS Enabled</span>
              <StatusBadge status={data.https} />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Mobile Friendliness</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Mobile Friendly</span>
              <StatusBadge status={data.mobileFriendly} />
            </div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Core Web Vitals</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Largest Contentful Paint (LCP)</span>
              <StatusBadge status={data.coreWebVitals.lcp} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">First Input Delay (FID)</span>
              <StatusBadge status={data.coreWebVitals.fid} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cumulative Layout Shift (CLS)</span>
              <StatusBadge status={data.coreWebVitals.cls} />
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Server Response Time</span>
              <span className="text-sm font-medium text-gray-900">{data.serverResponseTime} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Redirects</span>
              <span className="text-sm font-medium text-gray-900">{data.redirects.count}</span>
            </div>
          </div>
        </div>

        {/* Compression */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Compression</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Gzip Compression</span>
              <StatusBadge status={data.compression.gzip} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Brotli Compression</span>
              <StatusBadge status={data.compression.brotli} />
            </div>
          </div>
        </div>

        {/* Caching */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Caching</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Browser Caching Enabled</span>
              <StatusBadge status={data.caching.enabled} />
            </div>
            {data.caching.maxAge && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Max Age</span>
                <span className="text-sm font-medium text-gray-900">{data.caching.maxAge} seconds</span>
              </div>
            )}
          </div>
        </div>

        {/* CDN */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Content Delivery Network</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">CDN Detected</span>
              <StatusBadge status={data.cdn.detected} />
            </div>
            {data.cdn.detected && data.cdn.provider && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">CDN Provider</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{data.cdn.provider}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

