import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Market Intelligence Platform | Imagine Tools',
  description: 'AI-powered market intelligence platform that analyzes any topic, product, or industry in real-time',
  keywords: 'market intelligence, AI analysis, industry research, trend analysis, competitive intelligence',
  openGraph: {
    title: 'Market Intelligence Platform',
    description: 'Real-time AI-powered analysis for any topic or industry',
    url: 'https://imagine-tools.com',
    siteName: 'Imagine Tools',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}