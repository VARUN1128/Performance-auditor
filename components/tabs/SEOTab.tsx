'use client'

import type { SEOAudit } from '@/types/audit'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SEOTabProps {
  data: SEOAudit
}

function StatusBadge({ exists, good }: { exists: boolean; good?: boolean }) {
  if (good === undefined) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        exists ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {exists ? 'Present' : 'Missing'}
      </span>
    )
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      good ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
      {good ? 'Good' : 'Needs Improvement'}
    </span>
  )
}

export default function SEOTab({ data }: SEOTabProps) {
  // Prepare data for charts
  const headingsData = [
    { name: 'H1', value: data.headings.h1 },
    { name: 'H2', value: data.headings.h2 },
    { name: 'H3', value: data.headings.h3 },
    { name: 'H4', value: data.headings.h4 },
    { name: 'H5', value: data.headings.h5 },
    { name: 'H6', value: data.headings.h6 },
  ]

  const imagesData = [
    { name: 'With Alt Text', value: data.images.withAlt, color: '#10b981' },
    { name: 'Missing Alt Text', value: data.images.withoutAlt, color: '#ef4444' },
  ]

  const linksData = [
    { name: 'Internal', value: data.links.internal, color: '#3b82f6' },
    { name: 'External', value: data.links.external, color: '#8b5cf6' },
    { name: 'Broken', value: data.links.broken, color: '#ef4444' },
  ]

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#6366f1']

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">SEO Audit Results</h3>
      
      {/* Headings Structure Chart */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Headings Structure Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={headingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Images Alt Text Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Image Alt Text Coverage</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={imagesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {imagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Links Distribution Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Links Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={linksData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {linksData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Title Tag */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Title Tag</h4>
            <StatusBadge exists={data.title.exists} good={data.title.score >= 70} />
          </div>
          {data.title.exists ? (
            <>
              <p className="text-sm text-gray-600 mb-2">&ldquo;{data.title.content}&rdquo;</p>
              <p className="text-xs text-gray-500">
                Length: {data.title.length} characters {data.title.length < 30 || data.title.length > 60 ? '(Recommended: 30-60)' : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-red-600">Title tag is missing</p>
          )}
        </div>

        {/* Meta Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Meta Description</h4>
            <StatusBadge exists={data.metaDescription.exists} good={data.metaDescription.length >= 120 && data.metaDescription.length <= 160} />
          </div>
          {data.metaDescription.exists ? (
            <>
              <p className="text-sm text-gray-600 mb-2">&ldquo;{data.metaDescription.content}&rdquo;</p>
              <p className="text-xs text-gray-500">
                Length: {data.metaDescription.length} characters {data.metaDescription.length < 120 || data.metaDescription.length > 160 ? '(Recommended: 120-160)' : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-red-600">Meta description is missing</p>
          )}
        </div>

        {/* Headings */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Headings Structure</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h1}</div>
              <div className="text-xs text-gray-500 mt-1">H1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h2}</div>
              <div className="text-xs text-gray-500 mt-1">H2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h3}</div>
              <div className="text-xs text-gray-500 mt-1">H3</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h4}</div>
              <div className="text-xs text-gray-500 mt-1">H4</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h5}</div>
              <div className="text-xs text-gray-500 mt-1">H5</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{data.headings.h6}</div>
              <div className="text-xs text-gray-500 mt-1">H6</div>
            </div>
          </div>
          {data.headings.h1 === 0 && (
            <p className="text-sm text-red-600 mt-3">⚠️ No H1 heading found</p>
          )}
          {data.headings.h1 > 1 && (
            <p className="text-sm text-yellow-600 mt-3">⚠️ Multiple H1 headings found (recommended: 1)</p>
          )}
        </div>

        {/* Images */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Image Alt Tags</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-700">{data.images.total}</div>
              <div className="text-xs text-gray-500 mt-1">Total Images</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{data.images.withAlt}</div>
              <div className="text-xs text-gray-500 mt-1">With Alt Text</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{data.images.withoutAlt}</div>
              <div className="text-xs text-gray-500 mt-1">Missing Alt Text</div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Links Analysis</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.links.internal}</div>
              <div className="text-xs text-gray-500 mt-1">Internal Links</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{data.links.external}</div>
              <div className="text-xs text-gray-500 mt-1">External Links</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{data.links.broken}</div>
              <div className="text-xs text-gray-500 mt-1">Broken Links</div>
            </div>
          </div>
        </div>

        {/* Technical SEO */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Technical SEO</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Canonical Tag</span>
              <StatusBadge exists={data.canonical.exists} />
            </div>
            {data.canonical.exists && data.canonical.url && (
              <p className="text-xs text-gray-500 ml-4">{data.canonical.url}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Robots Meta Tag</span>
              <StatusBadge exists={data.robotsMeta.exists} />
            </div>
            {data.robotsMeta.exists && data.robotsMeta.content && (
              <p className="text-xs text-gray-500 ml-4">{data.robotsMeta.content}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sitemap</span>
              <StatusBadge exists={data.sitemap.exists} />
            </div>
            {data.sitemap.exists && data.sitemap.url && (
              <p className="text-xs text-gray-500 ml-4">{data.sitemap.url}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Robots.txt</span>
              <StatusBadge exists={data.robotsTxt.exists} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

