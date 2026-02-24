"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";

import { Button, Drawer, ThemeToggle, cn } from "@compass/ui";

import { useAuth } from "./Protected";
import { navItems } from "./navItems";

export function Topbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const visibleItems = navItems.filter((item) => !(item.adminOnly && user?.role !== "admin"));

  return (
    <>
      <header className="flex items-center justify-between border-b border-border/70 bg-card/40 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={18} />
          </Button>
          <div>
            <p className="text-xs text-text/60">Welcome back</p>
            <h1 className="text-lg font-semibold text-text">{user?.name ?? "Team Member"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-text/70">
            {user?.role ?? "member"}
          </span>
          <ThemeToggle />
          <Button variant="outline" onClick={logout} className="lg:hidden">
            <LogOut size={16} />
          </Button>
        </div>
      </header>
      <Drawer isOpen={open} onClose={() => setOpen(false)} title="Navigation" className="left-0 right-auto w-72">
        <nav className="grid gap-1 text-sm">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-text/80 transition hover:bg-muted"
                )}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4">
          <Button variant="outline" onClick={logout} className="w-full">
            Sign out
          </Button>
        </div>
      </Drawer>
    </>
  );
}
