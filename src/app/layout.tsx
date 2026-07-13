import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'ToLink - URL Shortener',
  description: 'Shorten your URLs with ToLink - Free, fast, and reliable URL shortening service',
  keywords: ['url shortener', 'link shortener', 'short links', 'tolink'],
}

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 