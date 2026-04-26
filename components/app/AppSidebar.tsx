"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  BookOpen,
  Kanban,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gerar", label: "Gerar conteúdo", icon: Wand2 },
  { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { href: "/kanban", label: "Kanban", icon: Kanban },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/conta", label: "Conta", icon: Settings },
];

export default function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-border flex flex-col shrink-0">
      {/* logo */}
      <div className="px-6 py-5 border-b border-border">
        <span className="text-xl font-semibold tracking-brand text-[#0C447C]">
          JIADVOCA
        </span>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#0C447C]/10 text-[#0C447C]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* user + logout */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <div className="px-3 py-2 text-xs text-muted-foreground truncate">
          {user.email}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
