// components/Sidebar.tsx

import { Home, MessageSquare, Settings, Rocket, Users } from "lucide-react";
import SidebarLink from "./SidebarLink";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  {
    label: "Prompt",
    href: "/dashboard/app",
    icon: <Home size={22} />,
  },
  {
    label: "Feedback",
    href: "/dashboard/app/feedback",
    icon: <MessageSquare size={22} />,
  },
  {
    label: "Settings",
    href: "/dashboard/app/settings",
    icon: <Settings size={22} />,
  },
  {
    label: "Deploy",
    href: "/dashboard/app/deploy",
    icon: <Rocket size={22} />,
  },
  // { label: "Admin", href: "/dashboard/app/admin", icon: <Users size={22} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-30 h-screen w-64 flex flex-col",
        "bg-gradient-to-b from-zinc-900/95 to-zinc-900/60 backdrop-blur-2xl",
        "border-r border-zinc-800 shadow-xl"
      )}
    >
      {/* Logo yoki brend qismini istalgancha o‘zgartirishingiz mumkin */}
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-xl font-bold tracking-tight text-white">
          ZeroDev
        </span>
        <span className="ml-2 rounded-lg bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          AI
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-3 mt-2">
        {navLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            active={pathname === link.href}
          />
        ))}
      </nav>
      <div className="mt-auto px-6 pb-6 flex flex-col gap-2">
        {/* Future: ThemeToggle, User profile, version info, etc. */}
        <span className="text-xs text-zinc-500">
          v2.0.0 &mdash; ABC LEGACY LLC
        </span>
      </div>
    </aside>
  );
}
