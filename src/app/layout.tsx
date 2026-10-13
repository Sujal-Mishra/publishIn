import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResearchHub — National Research Collaboration Ecosystem',
  description: 'A centralized research collaboration and management platform connecting students, professors, researchers, universities, laboratories, and funding agencies.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}
