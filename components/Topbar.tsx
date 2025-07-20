// components/Topbar.tsx

import { ChevronDown, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="fixed top-0 left-0 z-40 w-full h-16 flex items-center justify-between
      bg-gradient-to-tr from-zinc-950/90 via-zinc-900/80 to-zinc-950/80
      border-b border-zinc-800 backdrop-blur-xl shadow-lg px-6"
    >
      {/* Chap: Logo yoki AI model switcher joyi */}
      <div className="flex items-center gap-3">
        {/* App Logo yoki nomi */}
        <span className="text-lg font-bold tracking-tight text-white select-none">ZeroDev</span>
        {/* AI model tanlash uchun joy */}
        <button
          className="flex items-center gap-1 text-emerald-400 bg-zinc-800 rounded-lg px-3 py-1 ml-2 font-semibold text-sm hover:bg-zinc-700 transition"
          title="Switch AI model"
        >
          GPT-4o
          <ChevronDown size={18} className="ml-1 text-emerald-300" />
        </button>
        {/* Kelajakda: Workspace/project switcher qo‘shish mumkin */}
      </div>

      {/* O‘ng: User avatar/profil */}
      <div className="flex items-center gap-4">
        {/* Optional: Search yoki boshqa actionlar */}
        {/* User avatar */}
        <button
          className="flex items-center gap-2 text-white hover:text-emerald-400 transition"
          title="Account"
        >
          <UserCircle size={32} />
          <span className="hidden sm:inline font-medium text-sm">Username</span>
        </button>
      </div>
    </header>
  );
}
