// dashboard/app/layout.tsx

"use client";

import './styles/globals.css';
import ThemeToggle from './components/ThemeToggle';
import { ToastProvider } from './components/ToastContext';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import HamburgerButton from './components/HamburgerButton';
import { useState } from "react";

export const metadata = {
  title: 'ZeroDev AI',
  description: 'Next-level developer automation for everyone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black bg-gradient-to-tr from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <ToastProvider>
          {/* Topbar (mobile only) */}
          <div className="flex items-center justify-between lg:hidden px-4 py-4">
            <div className="flex items-center gap-2">
              <HamburgerButton onClick={() => setMobileOpen(true)} />
              <span className="font-bold text-white text-xl">ZeroDev</span>
            </div>
            <ThemeToggle />
          </div>
          {/* Sidebar (desktop only) */}
          <div className="hidden lg:flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 px-8 py-8">{children}</main>
          </div>
          {/* Mobile Drawer */}
          <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
          {/* Main content (mobile, sidebar closed) */}
          <div className="lg:hidden px-4 py-2">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
