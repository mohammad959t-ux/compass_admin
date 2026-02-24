import { createApiClient } from "@compass/ui";

import { expenses, leads, orders, packages, projects, reviews, services } from "./mock-data";
import type {
  AnalyticsSnapshot,
  CalendarEvent,
  Expense,
  Lead,
  Order,
  Package,
  Payment,
  Project,
  Review,
  Service,
  Settings,
  TeamMember
} from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const api = createApiClient({
  baseUrl,
  credentials: "include"
});

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function uploadAdminFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${baseUrl}/admin/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  if (!response.ok) {
    const data = await parseJsonSafely(response);
    const message =
      (data && (data as { message?: string }).message) ||
      response.statusText ||
      "Upload failed";
    throw new Error(message);
  }

  return (await parseJsonSafely(response)) as { url: string; publicId: string };
}

export { uploadAdminFile };

export async function fetchOrders(): Promise<Order[]> {
  try {
    const data = await api.get<Order[]>("/admin/orders");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createOrder(payload: {
  client: string;
  project: string;
  total: number;
  status?: Order["status"];
  dueDate: string;
}) {
  return api.post<Order>("/admin/orders", payload);
}

export async function updateOrder(id: string, payload: Partial<Order>) {
  return api.patch<Order>(`/admin/orders/${id}`, payload);
}

export async function deleteOrder(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/orders/${id}`);
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const data = await api.get<Service[]>("/admin/services");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createService(payload: {
  title: string;
  name?: string;
  category?: string;
  price?: number;
  coverUrl?: string;
}) {
  return api.post<Service>("/admin/services", payload);
}

export async function updateService(id: string, payload: Partial<Service>) {
  return api.patch<Service>(`/admin/services/${id}`, payload);
}

export async function deleteService(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/services/${id}`);
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await api.get<Project[]>("/admin/projects");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createProject(payload: {
  title: string;
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
  owner?: string;
  status?: Project["status"];
  budget?: number;
  coverUrl?: string;
  images?: string[];
}) {
  return api.post<Project>("/admin/projects", payload);
}

export async function deleteProject(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/projects/${id}`);
}

export async function updateProject(id: string, payload: Partial<{
  title: string;
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
  owner?: string;
  status?: Project["status"];
  budget?: number;
  coverUrl?: string;
  images?: string[];
}>) {
  return api.put<Project>(`/admin/projects/${id}`, payload);
}

export async function fetchPackages(): Promise<Package[]> {
  try {
    const data = await api.get<Package[]>("/admin/packages");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createPackage(payload: {
  title: string;
  name?: string;
  price?: number;
  status?: Package["status"];
  coverUrl?: string;
}) {
  return api.post<Package>("/admin/packages", payload);
}

export async function deletePackage(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/packages/${id}`);
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const data = await api.get<Review[]>("/admin/reviews");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function updateReview(id: string, payload: { status?: Review["status"]; quote?: string }) {
  return api.patch<Review>(`/admin/reviews/${id}`, payload);
}

export async function deleteReview(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/reviews/${id}`);
}

export async function createReviewLink() {
  const { token } = await api.post<{ token: string }>("/admin/reviews/link", {});
  return token;
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const data = await api.get<Lead[]>("/admin/leads");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createLead(payload: {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
}) {
  return api.post<Lead>("/leads", payload);
}

export async function updateLead(id: string, payload: { status?: Lead["status"] }) {
  return api.patch<Lead>(`/admin/leads/${id}`, payload);
}

export async function deleteLead(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/leads/${id}`);
}

export async function fetchExpenses(): Promise<Expense[]> {
  try {
    const data = await api.get<Expense[]>("/admin/expenses");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createExpense(payload: {
  vendor: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}) {
  return api.post<Expense>("/admin/expenses", payload);
}

export async function deleteExpense(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/expenses/${id}`);
}

export async function createPayment(payload: {
  orderId: string;
  amount: number;
  status?: Payment["status"];
  method?: string;
  paidAt?: string;
  note?: string;
}) {
  return api.post<Payment>("/admin/payments", payload);
}

export async function fetchPayments(): Promise<Payment[]> {
  return api.get<Payment[]>("/admin/payments");
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  return api.get<CalendarEvent[]>("/admin/calendar");
}

export async function createCalendarEvent(payload: {
  title: string;
  date: string;
  type?: string;
  status?: CalendarEvent["status"];
  notes?: string;
}) {
  return api.post<CalendarEvent>("/admin/calendar", payload);
}

export async function fetchSettings(): Promise<Settings> {
  return api.get<Settings>("/admin/settings");
}

export async function updateSettings(payload: Partial<Settings>) {
  return api.patch<Settings>("/admin/settings", payload);
}

export async function fetchAnalytics(): Promise<AnalyticsSnapshot> {
  try {
    return await api.get<AnalyticsSnapshot>("/admin/analytics");
  } catch {
    return {
      revenue: 0,
      expenses: 0,
      net: 0,
      outstanding: 0,
      openLeads: 0,
      activeProjects: 0,
      chartData: []
    };
  }
}


export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await api.get<TeamMember[]>("/admin/team");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createTeamMember(payload: Omit<TeamMember, "_id" | "id" | "order">) {
  return api.post<TeamMember>("/admin/team", payload);
}

export async function updateTeamMember(id: string, payload: Partial<TeamMember>) {
  return api.patch<TeamMember>(`/admin/team/${id}`, payload);
}

export async function deleteTeamMember(id: string) {
  return api.delete<{ ok: boolean }>(`/admin/team/${id}`);
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  return api.patch<{ ok: boolean }>("/admin/team/reorder", { items });
}
