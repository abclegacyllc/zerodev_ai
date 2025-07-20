// components/Topbar.tsx

import { UserCircle } from "lucide-react";
import ModelDropdown from "./ModelDropdown";
import { useState } from "react";

export default function Topbar() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  return (
    <header
      className="fixed top-0 left-0 z-40 w-full h-16 flex items-center justify-between
      bg-gradient-to-tr from-zinc-950/90 via-zinc-900/80 to-zinc-950/80
      border-b border-zinc-800 backdrop-blur-xl shadow-lg px-6"
    >
      {/* Chap: Logo va model switcher */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-white select-none">ZeroDev</span>
        <ModelDropdown selected={selectedModel} onSelect={setSelectedModel} />
      </div>

      {/* O‘ng: User avatar/profil */}
      <div className="flex items-center gap-4">
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
