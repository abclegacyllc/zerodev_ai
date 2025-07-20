// dashboard/app/layout.tsx

import './styles/globals.css';
import ThemeToggle from './components/ThemeToggle';
import { ToastProvider } from './components/ToastContext';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'ZeroDev AI',
  description: 'Next-level developer automation for everyone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black bg-gradient-to-tr from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <ToastProvider>
          <div className="flex min-h-screen">
            {/* Chap tomonda Sidebar */}
            <Sidebar />
            {/* O‘ng tomonda asosiy content */}
            <main className="flex-1 ml-64 px-8 py-8">
              {/* ThemeToggle ni content ustiga yoki istalgan joyga qo‘yishingiz mumkin */}
              <div className="flex justify-end mb-4">
                <ThemeToggle />
              </div>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
