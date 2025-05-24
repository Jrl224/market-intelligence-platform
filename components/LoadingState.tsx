'use client'

import { useEffect, useState } from 'react'

interface LoadingStateProps {
  query: string
}

interface LoadingStep {
  id: string
  name: string
  status: 'pending' | 'loading' | 'completed' | 'error'
  message?: string
}

export default function LoadingState({ query }: LoadingStateProps) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: 'summary', name: 'Generating executive summary', status: 'pending' },
    { id: 'trends', name: 'Analyzing market trends', status: 'pending' },
    { id: 'news', name: 'Gathering latest news', status: 'pending' },
    { id: 'sentiment', name: 'Analyzing community sentiment', status: 'pending' },
    { id: 'research', name: 'Searching academic research', status: 'pending' },
    { id: 'patents', name: 'Scanning patent databases', status: 'pending' },
    { id: 'economic', name: 'Fetching economic indicators', status: 'pending' },
    { id: 'financial', name: 'Analyzing financial data', status: 'pending' },
    { id: 'insights', name: 'Generating AI insights', status: 'pending' }
  ])
  
  useEffect(() => {
    // Simulate progressive loading
    const timers: NodeJS.Timeout[] = []
    
    steps.forEach((step, index) => {
      // Start loading
      timers.push(
        setTimeout(() => {
          setSteps(prev => 
            prev.map(s => s.id === step.id ? { ...s, status: 'loading' } : s)
          )
        }, index * 300)
      )
      
      // Complete loading
      timers.push(
        setTimeout(() => {
          setSteps(prev => 
            prev.map(s => s.id === step.id ? { ...s, status: 'completed' } : s)
          )
        }, index * 300 + 1500 + Math.random() * 1000)
      )
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])
  
  const getStatusIcon = (status: LoadingStep['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        )
      case 'loading':
        return (
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        )
      case 'completed':
        return (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )
    }
  }
  
  const completedCount = steps.filter(s => s.status === 'completed').length
  const progress = (completedCount / steps.length) * 100
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing "{query}"
          </h2>
          <p className="text-gray-600">
            Gathering intelligence from multiple sources
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Loading steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center space-x-3 transition-opacity duration-300 ${
                step.status === 'pending' ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {getStatusIcon(step.status)}
              <div className="flex-1">
                <p className={`text-sm ${
                  step.status === 'completed' ? 'text-gray-700' : 'text-gray-600'
                }`}>
                  {step.name}
                </p>
                {step.message && (
                  <p className="text-xs text-gray-500">{step.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This typically takes 10-30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
