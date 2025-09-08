import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { LanguageProvider } from '@/lib/language-context'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthcare AI Assistant',
  description: 'AI-driven SaaS solution for healthcare professionals',
  keywords: ['healthcare', 'AI', 'medical transcription', 'SOAP notes', 'medical coding'],
  authors: [{ name: 'Healthcare AI Team' }],
  robots: 'noindex, nofollow', // Important for medical data
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          <Providers>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  )
}