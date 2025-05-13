// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import ClientOnly from '@/components/client-only' // create this component below

export const metadata = {
  title: 'Tongue Health Analyzer',
  description: 'Analyze your tongue for potential health insights',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  )
}
