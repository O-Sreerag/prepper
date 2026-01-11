import type { Metadata } from 'next'
import { Suspense } from "react";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "./react-query-provider";
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="text-sm flex items-center justify-center h-screen">Loading Merit-HRMS...</div>}>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </Suspense> 
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
