import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    titleAr: z.string().optional(),
    titleEn: z.string().optional(),
    name: z.string().optional(),
    nameAr: z.string().optional(),
    nameEn: z.string().optional(),
    slug: z.string().optional(),
    category: z.string().optional(),
    categoryAr: z.string().optional(),
    categoryEn: z.string().optional(),
    summary: z.string().optional(),
    summaryAr: z.string().optional(),
    summaryEn: z.string().optional(),
    results: z.union([z.array(z.string()), z.string()]).optional(),
    resultsAr: z.union([z.array(z.string()), z.string()]).optional(),
    resultsEn: z.union([z.array(z.string()), z.string()]).optional(),
    role: z.string().optional(),
    roleAr: z.string().optional(),
    roleEn: z.string().optional(),
    outcome: z.string().optional(),
    outcomeAr: z.string().optional(),
    outcomeEn: z.string().optional(),
    status: z.enum(["active", "paused", "complete"]).optional(),
    owner: z.string().optional(),
    budget: z.number().optional(),
    coverUrl: z.string().url().optional(),
    images: z.union([z.array(z.string()), z.string()]).optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    titleAr: z.string().optional(),
    titleEn: z.string().optional(),
    name: z.string().optional(),
    nameAr: z.string().optional(),
    nameEn: z.string().optional(),
    slug: z.string().optional(),
    category: z.string().optional(),
    categoryAr: z.string().optional(),
    categoryEn: z.string().optional(),
    summary: z.string().optional(),
    summaryAr: z.string().optional(),
    summaryEn: z.string().optional(),
    results: z.union([z.array(z.string()), z.string()]).optional(),
    resultsAr: z.union([z.array(z.string()), z.string()]).optional(),
    resultsEn: z.union([z.array(z.string()), z.string()]).optional(),
    role: z.string().optional(),
    roleAr: z.string().optional(),
    roleEn: z.string().optional(),
    outcome: z.string().optional(),
    outcomeAr: z.string().optional(),
    outcomeEn: z.string().optional(),
    status: z.enum(["active", "paused", "complete"]).optional(),
    owner: z.string().optional(),
    budget: z.number().optional(),
    coverUrl: z.string().url().optional(),
    images: z.union([z.array(z.string()), z.string()]).optional()
  })
});
