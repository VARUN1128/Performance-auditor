'use client'

import type { PerformanceMetrics } from '@/types/audit'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface PerformanceTabProps {
  data: PerformanceMetrics
}

function MetricRow({ label, value, unit, goodThreshold, warningThreshold }: {
  label: string
  value: number
  unit: string
  goodThreshold: number
  warningThreshold: number
}) {
  const getStatus = () => {
    if (value <= goodThreshold) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Good' }
    if (value <= warningThreshold) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' }
    return { color: 'text-red-600', bg: 'bg-red-100', label: 'Poor' }
  }

  const status = getStatus()

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-900">
          {value.toLocaleString()} {unit}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>
    </div>
  )
}

export default function PerformanceTab({ data }: PerformanceTabProps) {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Prepare data for charts
  const performanceMetrics = [
    { name: 'Page Load', value: data.pageLoadTime, threshold: 1000, warning: 3000 },
    { name: 'FCP', value: data.firstContentfulPaint, threshold: 1800, warning: 3000 },
    { name: 'LCP', value: data.largestContentfulPaint, threshold: 2500, warning: 4000 },
    { name: 'TTI', value: data.timeToInteractive, threshold: 3800, warning: 7300 },
    { name: 'TBT', value: data.totalBlockingTime, threshold: 200, warning: 600 },
  ]

  const coreWebVitalsData = [
    { metric: 'LCP', score: data.largestContentfulPaint <= 2500 ? 100 : data.largestContentfulPaint <= 4000 ? 50 : 0, fullMark: 100 },
    { metric: 'FID', score: data.totalBlockingTime <= 200 ? 100 : data.totalBlockingTime <= 600 ? 50 : 0, fullMark: 100 },
    { metric: 'CLS', score: data.cumulativeLayoutShift <= 0.1 ? 100 : data.cumulativeLayoutShift <= 0.25 ? 50 : 0, fullMark: 100 },
  ]

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
      
      {/* Performance Metrics Chart */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Performance Metrics (ms)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0284c7" name="Current Value" />
            <Bar dataKey="threshold" fill="#10b981" name="Good Threshold" />
            <Bar dataKey="warning" fill="#f59e0b" name="Warning Threshold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Core Web Vitals Radar Chart */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals Score</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={coreWebVitalsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Score" dataKey="score" stroke="#0284c7" fill="#0284c7" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        <MetricRow
          label="Page Load Time"
          value={data.pageLoadTime}
          unit="ms"
          goodThreshold={1000}
          warningThreshold={3000}
        />
        <MetricRow
          label="First Contentful Paint (FCP)"
          value={data.firstContentfulPaint}
          unit="ms"
          goodThreshold={1800}
          warningThreshold={3000}
        />
        <MetricRow
          label="Largest Contentful Paint (LCP)"
          value={data.largestContentfulPaint}
          unit="ms"
          goodThreshold={2500}
          warningThreshold={4000}
        />
        <MetricRow
          label="Time to Interactive (TTI)"
          value={data.timeToInteractive}
          unit="ms"
          goodThreshold={3800}
          warningThreshold={7300}
        />
        <MetricRow
          label="Total Blocking Time (TBT)"
          value={data.totalBlockingTime}
          unit="ms"
          goodThreshold={200}
          warningThreshold={600}
        />
        <MetricRow
          label="Cumulative Layout Shift (CLS)"
          value={data.cumulativeLayoutShift}
          unit=""
          goodThreshold={0.1}
          warningThreshold={0.25}
        />
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div className="flex-1">
            <p className="font-medium text-gray-900">Page Size</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">
              {formatBytes(data.pageSize)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div className="flex-1">
            <p className="font-medium text-gray-900">Number of Requests</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">
              {data.numberOfRequests}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

