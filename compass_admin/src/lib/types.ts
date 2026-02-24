export type OrderStatus = "pending" | "in-progress" | "completed";
export type ReviewStatus = "pending" | "approved" | "archived";
export type LeadStatus = "new" | "contacted" | "won" | "lost";
export type ProjectStatus = "active" | "paused" | "complete";
export type PackageStatus = "live" | "draft";
export type CalendarStatus = "scheduled" | "completed" | "canceled";
export type PaymentStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  client: string;
  project: string;
  total: number;
  status: OrderStatus;
  dueDate: string;
};

export type Service = {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  price?: number;
  priceRange?: string;
  coverUrl?: string;
};

export type Project = {
  id: string;
  title?: string;
  titleAr?: string;
  titleEn?: string;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  category?: string;
  categoryAr?: string;
  categoryEn?: string;
  summary?: string;
  summaryAr?: string;
  summaryEn?: string;
  results?: string[];
  resultsAr?: string[];
  resultsEn?: string[];
  role?: string;
  roleAr?: string;
  roleEn?: string;
  outcome?: string;
  outcomeAr?: string;
  outcomeEn?: string;
  status: ProjectStatus;
  owner?: string;
  budget?: number;
  coverUrl?: string;
  images?: string[];
};

export type Package = {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  status: PackageStatus;
};

export type Review = {
  id: string;
  client?: string;
  name?: string;
  rating: number;
  status: ReviewStatus;
  token: string;
  quote?: string;
  serviceCategory?: string;
  project?: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
  company?: string;
  budget?: string;
  message?: string;
};

export type Expense = {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type?: string;
  status?: CalendarStatus;
  notes?: string;
};

export type Settings = {
  id: string;
  minDepositPercent: number;
  featureFlags: Record<string, boolean>;
  serviceCategoryCovers?: Record<string, string>;
};

export type AnalyticsSnapshot = {
  revenue: number;
  expenses: number;
  net: number;
  outstanding: number;
  openLeads: number;
  activeProjects: number;
  chartData: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method?: string;
  paidAt?: string;
  note?: string;
};

export type TeamMember = {
  _id: string;
  id?: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  order: number;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
};
