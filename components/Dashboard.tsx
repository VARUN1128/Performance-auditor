'use client'

import { useState } from 'react'
import type { AuditResult } from '@/types/audit'
import SummaryCards from './SummaryCards'
import PerformanceTab from './tabs/PerformanceTab'
import SEOTab from './tabs/SEOTab'
import TechnicalTab from './tabs/TechnicalTab'
import IssuesTab from './tabs/IssuesTab'
import { generatePDF } from '@/lib/pdf-generator'

interface DashboardProps {
  result: AuditResult
}

type Tab = 'performance' | 'seo' | 'technical' | 'issues'

export default function Dashboard({ result }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('performance')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(result)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'performance', label: 'Performance' },
    { id: 'seo', label: 'SEO' },
    { id: 'technical', label: 'Technical' },
    { id: 'issues', label: 'Actionable Fixes' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4 border-blue-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="/legacy-logo.jpg" 
                alt="Legacy Incorp._G" 
                className="h-10 w-auto object-contain"
              />
              <h2 className="text-2xl font-bold text-gray-900">Audit Results</h2>
            </div>
            <p className="text-gray-600 mt-1 font-medium">{result.url}</p>
            <p className="text-sm text-gray-500 mt-1">
              Audit Date: {new Date(result.date).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report as PDF
              </>
            )}
          </button>
        </div>

        <SummaryCards result={result} />
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'performance' && <PerformanceTab data={result.performance} />}
          {activeTab === 'seo' && <SEOTab data={result.seo} />}
          {activeTab === 'technical' && <TechnicalTab data={result.technical} />}
          {activeTab === 'issues' && <IssuesTab issues={result.issues} />}
        </div>
      </div>
    </div>
  )
}

