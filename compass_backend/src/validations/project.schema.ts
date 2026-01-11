import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    name: z.string().optional(),
    slug: z.string().optional(),
    category: z.string().optional(),
    summary: z.string().optional(),
    results: z.union([z.array(z.string()), z.string()]).optional(),
    role: z.string().optional(),
    outcome: z.string().optional(),
    status: z.enum(["active", "paused", "complete"]).optional(),
    owner: z.string().optional(),
    budget: z.number().optional(),
    coverUrl: z.string().url().optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    category: z.string().optional(),
    summary: z.string().optional(),
    results: z.union([z.array(z.string()), z.string()]).optional(),
    role: z.string().optional(),
    outcome: z.string().optional(),
    status: z.enum(["active", "paused", "complete"]).optional(),
    owner: z.string().optional(),
    budget: z.number().optional(),
    coverUrl: z.string().url().optional()
  })
});
