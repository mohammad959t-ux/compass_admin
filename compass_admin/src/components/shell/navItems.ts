import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  UsersRound
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Services", href: "/services", icon: FileText },
  { label: "Projects", href: "/projects", icon: ShieldCheck },
  { label: "Packages", href: "/packages", icon: Package },
  { label: "Reviews", href: "/reviews", icon: UsersRound },
  { label: "Leads", href: "/leads", icon: BarChart3 },
  { label: "Team", href: "/team", icon: UsersRound },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Analytics", href: "/analytics", icon: BarChart3, adminOnly: true },
  { label: "Settings", href: "/settings", icon: Settings, adminOnly: true }
];
