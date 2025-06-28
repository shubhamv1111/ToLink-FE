import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'ToLink - URL Shortener',
  description: 'Shorten your URLs with ToLink - Free, fast, and reliable URL shortening service',
  keywords: ['url shortener', 'link shortener', 'short links', 'tolink'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 