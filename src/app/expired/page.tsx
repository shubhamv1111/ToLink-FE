'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarX2, Link2 } from 'lucide-react'

export default function ExpiredPage() {
  const search = useSearchParams()
  const router = useRouter()
  const code = search.get('code') || ''
  const exp = search.get('exp')
  const dateText = exp ? new Date(exp).toLocaleString() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="p-10 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 text-center max-w-xl w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CalendarX2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">This link has expired</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            The link you tried to open is no longer available.
          </p>
          {dateText && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Expired on: {dateText}
            </p>
          )}
          {code && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">Code: /{code}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Go Home
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}


