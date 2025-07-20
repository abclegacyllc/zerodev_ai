// dashboard/app/layout.tsx

import './styles/globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata = {
  title: 'ZeroDev AI',
  description: 'Next-level developer automation for everyone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Debug banner (remove after F04 complete) */}
        <div className="bg-yellow-300 text-black font-semibold text-sm px-4 py-2 border-b border-yellow-600 shadow-md">
          🧭 Layout Rendered — If you see this, routing is working ✅
        </div>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
