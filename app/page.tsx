'use client'

import { useState } from 'react'
import AuditForm from '@/components/AuditForm'
import Dashboard from '@/components/Dashboard'
import type { AuditResult } from '@/types/audit'

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuditComplete = (result: AuditResult) => {
    setAuditResult(result)
    setIsLoading(false)
  }

  const handleAuditStart = () => {
    setIsLoading(true)
    setAuditResult(null)
  }

  const scrollToAudit = () => {
    document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation Header */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <img 
                  src="/legacy-logo.jpg" 
                  alt="Legacy Incorp._G Business Support" 
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Legacy SEO Optimizer</h1>
                <p className="text-xs text-gray-600">By Legacy Incorp._G Business Support</p>
              </div>
            </div>
            <button
              onClick={scrollToAudit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Start Audit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        {!auditResult && (
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
              <div className="w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
            <div className="relative z-10">
              <div className="inline-block mb-6 animate-pulse-glow">
                <span className="px-6 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100 shadow-md">
                  ✨ Professional SEO & Performance Analysis
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Optimize Your Website's
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Performance & SEO
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Get comprehensive insights into your website's SEO, performance metrics, and technical health. 
                <br className="hidden md:block" />
                Identify issues and receive actionable recommendations to improve your online presence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={scrollToAudit}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Get Started Free</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Form Section */}
        <div id="audit-section" className="mb-16">
          <AuditForm
            onAuditStart={handleAuditStart}
            onAuditComplete={handleAuditComplete}
            isLoading={isLoading}
          />
        </div>

        {/* Features Section - Only show when no audit result */}
        {!auditResult && (
          <>
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
                    Core Features
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Comprehensive Analysis Features
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Everything you need to understand and improve your website's performance
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card group">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Performance Metrics</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Analyze page load times, Core Web Vitals, and performance scores to ensure optimal user experience and faster page speeds.
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="feature-card group">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">SEO Analysis</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Evaluate title tags, meta descriptions, headings structure, images, and links for better search rankings and visibility.
                  </p>
                  <div className="mt-6 flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="feature-card group">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Technical Checks</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Verify HTTPS, mobile-friendliness, compression, caching, CDN, and Core Web Vitals compliance for optimal performance.
                  </p>
                  <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 shadow-sm">
                    ✨ Simple Process
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  How It Works
                </h3>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get comprehensive website analysis in just four simple steps
                </p>
              </div>
              
              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl -z-10"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative p-8 md:p-12">
                  {/* Animated Connection Line with Arrows */}
                  <div className="hidden md:block absolute top-24 left-8 right-8 h-1">
                    <div className="relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      {/* Arrow indicators */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="absolute top-1/2 transform -translate-y-1/2"
                          style={{ left: `${(i * 25)}%` }}
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    { 
                      step: '1', 
                      title: 'Enter URL', 
                      desc: 'Simply enter your website URL to begin the comprehensive analysis', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      ), 
                      color: 'from-blue-500 to-cyan-500',
                      bgColor: 'bg-blue-50',
                      borderColor: 'border-blue-200'
                    },
                    { 
                      step: '2', 
                      title: 'Deep Analysis', 
                      desc: 'Our advanced system performs comprehensive checks on all aspects of your site', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      ), 
                      color: 'from-purple-500 to-pink-500',
                      bgColor: 'bg-purple-50',
                      borderColor: 'border-purple-200'
                    },
                    { 
                      step: '3', 
                      title: 'Get Insights', 
                      desc: 'Receive detailed reports with scores, charts, and actionable recommendations', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ), 
                      color: 'from-pink-500 to-rose-500',
                      bgColor: 'bg-pink-50',
                      borderColor: 'border-pink-200'
                    },
                    { 
                      step: '4', 
                      title: 'Take Action', 
                      desc: 'Download professional PDF reports and implement suggested improvements', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ), 
                      color: 'from-indigo-500 to-blue-500',
                      bgColor: 'bg-indigo-50',
                      borderColor: 'border-indigo-200'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Step Card */}
                      <div className={`relative bg-white rounded-2xl p-6 md:p-8 border-2 ${item.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 ${item.bgColor} bg-opacity-50`}>
                        {/* Number Badge */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20">
                          <span className="text-white text-lg font-bold">{item.step}</span>
                        </div>
                        
                        {/* Icon Container */}
                        <div className="relative mb-6 mt-4">
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                          <div className={`relative w-24 h-24 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                            <div className="text-white">
                              {item.icon}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="text-center">
                          <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {item.desc}
                          </p>
                        </div>
                        
                        {/* Hover Effect Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mb-20 relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
              <div className="relative p-12 md:p-16 text-white">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h3>
                  <p className="text-blue-100 text-lg">Comprehensive analysis at your fingertips</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="group">
                    <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      100+
                    </div>
                    <div className="text-blue-100 font-medium">Checks Performed</div>
                    <div className="text-blue-200 text-sm mt-1">Per Analysis</div>
                  </div>
                  <div className="group">
                    <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      Real-time
                    </div>
                    <div className="text-blue-100 font-medium">Analysis</div>
                    <div className="text-blue-200 text-sm mt-1">Instant Results</div>
                  </div>
                  <div className="group">
                    <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      PDF
                    </div>
                    <div className="text-blue-100 font-medium">Detailed Reports</div>
                    <div className="text-blue-200 text-sm mt-1">Professional Format</div>
                  </div>
                  <div className="group">
                    <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      Free
                    </div>
                    <div className="text-blue-100 font-medium">To Use</div>
                    <div className="text-blue-200 text-sm mt-1">No Credit Card</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100">
                    Why Choose Us
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Choose Legacy SEO Optimizer?
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Everything you need to optimize your website's performance and SEO
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: '✓', title: 'Comprehensive Analysis', desc: 'Get insights into performance, SEO, and technical aspects in one comprehensive report', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: '📊', title: 'Visual Reports', desc: 'Interactive charts and graphs to understand your website metrics at a glance', gradient: 'from-purple-500 to-pink-500' },
                  { icon: '📄', title: 'PDF Export', desc: 'Download professional PDF reports for documentation, sharing, and presentations', gradient: 'from-indigo-500 to-blue-500' },
                  { icon: '🎯', title: 'Actionable Insights', desc: 'Receive prioritized recommendations to improve your website effectively', gradient: 'from-emerald-500 to-teal-500' },
                  { icon: '⚡', title: 'Fast & Accurate', desc: 'Get detailed analysis results in seconds with high accuracy and precision', gradient: 'from-yellow-500 to-orange-500' },
                  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is processed securely and never stored on our servers', gradient: 'from-red-500 to-pink-500' },
                ].map((benefit, idx) => (
                  <div key={idx} className="group modern-card relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <div className="relative z-10">
                      <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 text-white text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                        {benefit.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{benefit.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Audit Results */}
        {auditResult && <Dashboard result={auditResult} />}

        {/* Footer */}
        {!auditResult && (
          <footer className="mt-20 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600 mb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img 
                  src="/legacy-logo.jpg" 
                  alt="Legacy Incorp._G Business Support" 
                  className="h-10 w-auto object-contain opacity-80"
                />
                <span className="font-semibold text-gray-700">Legacy Incorp._G Business Support</span>
              </div>
              <p className="text-sm">
                Professional SEO & Performance Audit Tool
              </p>
              <p className="text-xs mt-2 text-gray-500">
                © {new Date().getFullYear()} Legacy Incorp._G Business Support. All rights reserved.
              </p>
            </div>
          </footer>
        )}
      </div>
    </main>
  )
}

