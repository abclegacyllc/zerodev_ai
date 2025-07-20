// dashboard/app/layout.tsx

import './styles/globals.css'
import ThemeToggle from './components/ThemeToggle'
import { ToastProvider } from './components/ToastContext'

export const metadata = {
  title: 'ZeroDev AI',
  description: 'Next-level developer automation for everyone'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black bg-gradient-to-tr from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <ToastProvider>
          <ThemeToggle />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
