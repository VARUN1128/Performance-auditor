'use client'

import type { Issue } from '@/types/audit'

interface IssuesTabProps {
  issues: Issue[]
}

function ImpactBadge({ impact }: { impact: 'low' | 'medium' | 'high' }) {
  const colors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[impact]}`}>
      {impact.toUpperCase()}
    </span>
  )
}

export default function IssuesTab({ issues }: IssuesTabProps) {
  const groupedIssues = {
    high: issues.filter(i => i.impact === 'high'),
    medium: issues.filter(i => i.impact === 'medium'),
    low: issues.filter(i => i.impact === 'low'),
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Issues Found!</h3>
        <p className="text-gray-600">Your website is performing well across all metrics.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Actionable Fixes</h3>
      
      <div className="space-y-6">
        {groupedIssues.high.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-red-700 mb-3">
              High Priority ({groupedIssues.high.length})
            </h4>
            <div className="space-y-3">
              {groupedIssues.high.map((issue, idx) => (
                <div key={idx} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{issue.problem}</h5>
                    <ImpactBadge impact={issue.impact} />
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">Fix:</span> {issue.fix}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    {issue.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedIssues.medium.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-3">
              Medium Priority ({groupedIssues.medium.length})
            </h4>
            <div className="space-y-3">
              {groupedIssues.medium.map((issue, idx) => (
                <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{issue.problem}</h5>
                    <ImpactBadge impact={issue.impact} />
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">Fix:</span> {issue.fix}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                    {issue.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedIssues.low.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-3">
              Low Priority ({groupedIssues.low.length})
            </h4>
            <div className="space-y-3">
              {groupedIssues.low.map((issue, idx) => (
                <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{issue.problem}</h5>
                    <ImpactBadge impact={issue.impact} />
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">Fix:</span> {issue.fix}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {issue.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

