"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, ThemeToggle, cn } from "@compass/ui";

import { useAuth } from "./Protected";
import { navItems } from "./navItems";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-64 flex-col gap-4 border-r border-border/70 bg-card/40 p-6 lg:flex">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-text">Compass Admin</p>
        <p className="text-xs text-text/60">Digital operations center</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== "admin") return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                isActive ? "bg-text text-bg" : "text-text/70 hover:bg-muted"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3">
        <ThemeToggle />
        <Button variant="outline" onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
