import type { Expense, Lead, Order, Package, Project, Review, Service } from "./types";

export const orders: Order[] = [
  {
    id: "ORD-1024",
    client: "Lumen Payments",
    project: "Growth Site",
    total: 18000,
    status: "in-progress",
    dueDate: "2026-02-04"
  },
  {
    id: "ORD-1025",
    client: "Atlas Ventures",
    project: "Brand System",
    total: 12000,
    status: "pending",
    dueDate: "2026-01-28"
  },
  {
    id: "ORD-1026",
    client: "Veridian Health",
    project: "Product Portal",
    total: 24000,
    status: "completed",
    dueDate: "2025-12-18"
  }
];

export const services: Service[] = [
  { id: "SVC-1", name: "Brand Strategy", category: "Strategy", price: 6000 },
  { id: "SVC-2", name: "Web Experience", category: "Design", price: 9500 },
  { id: "SVC-3", name: "Growth Systems", category: "Automation", price: 7000 }
];

export const projects: Project[] = [
  { id: "PRJ-1", name: "Lumen Payments", status: "active", owner: "Amina Al Noor" },
  { id: "PRJ-2", name: "Atlas Ventures", status: "paused", owner: "Javier Suarez" },
  { id: "PRJ-3", name: "Veridian Health", status: "complete", owner: "Priya Singh" }
];

export const packages: Package[] = [
  { id: "PKG-1", name: "Launch Pad", price: 4900, status: "live" },
  { id: "PKG-2", name: "Growth Surge", price: 9500, status: "live" },
  { id: "PKG-3", name: "Enterprise Elevation", price: 18000, status: "draft" }
];

export const reviews: Review[] = [
  { id: "REV-1", client: "Lumen Payments", rating: 5, status: "approved", token: "lm-450" },
  { id: "REV-2", client: "Atlas Ventures", rating: 4, status: "pending", token: "av-982" },
  { id: "REV-3", client: "Veridian Health", rating: 5, status: "approved", token: "vh-301" }
];

export const leads: Lead[] = [
  { id: "LED-1", name: "Noor Al Abbas", email: "noor@atlas.com", status: "new", createdAt: "2026-01-02" },
  { id: "LED-2", name: "Ravi Patel", email: "ravi@lumen.com", status: "contacted", createdAt: "2026-01-04" },
  { id: "LED-3", name: "Claire Kent", email: "claire@veridian.com", status: "won", createdAt: "2025-12-20" }
];

export const expenses: Expense[] = [
  { id: "EXP-1", vendor: "Figma", category: "Software", amount: 84, date: "2026-01-02" },
  { id: "EXP-2", vendor: "AWS", category: "Infrastructure", amount: 210, date: "2026-01-05" },
  { id: "EXP-3", vendor: "Slack", category: "Collaboration", amount: 65, date: "2026-01-06" }
];