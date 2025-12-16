'use client'

import type { AuditResult } from '@/types/audit'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SummaryCardsProps {
  result: AuditResult
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getScoreBgColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
      </p>
    </div>
  )
}

export default function SummaryCards({ result }: SummaryCardsProps) {
  const scoresData = [
    { name: 'Overall', score: result.overallScore },
    { name: 'Performance', score: result.performance.score },
    { name: 'SEO', score: result.seo.score },
    { name: 'Technical', score: result.technical.score },
  ]

  return (
    <div className="mt-6">
      {/* Score Comparison Chart */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Overview</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={scoresData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-primary-800">Overall Score</h3>
            <span className="text-3xl font-bold text-primary-700">
              {result.overallScore}
            </span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${result.overallScore}%` }}
            />
          </div>
          <p className="text-xs text-primary-700 mt-2">
            {result.overallScore >= 80 ? 'Excellent' : result.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
        <ScoreCard label="Performance" score={result.performance.score} color="blue" />
        <ScoreCard label="SEO" score={result.seo.score} color="green" />
        <ScoreCard label="Technical" score={result.technical.score} color="purple" />
      </div>
    </div>
  )
}

