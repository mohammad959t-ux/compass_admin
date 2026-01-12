import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    MONGO_URI: z.string().optional().or(z.literal("")),
    CLOUDINARY_URL: z.string().min(1, "CLOUDINARY_URL is required").optional().or(z.literal("")),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    COOKIE_DOMAIN: z.string().optional().or(z.literal("")),
    CORS_ORIGINS: z.string().optional().or(z.literal("")),
    ADMIN_EMAIL: z.string().email().default("admin@compass.test"),
    ADMIN_PASSWORD: z.string().min(6).default("admin123"),
    MIN_DEPOSIT_PERCENT: z.coerce.number().min(1).max(100).default(20),
    SMTP_HOST: z.string().optional().or(z.literal("")),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional().or(z.literal("")),
    SMTP_PASS: z.string().optional().or(z.literal("")),
    SMTP_SECURE: z.string().optional().or(z.literal("")),
    EMAIL_FROM: z.string().email().optional().or(z.literal("")),
    EMAIL_TO: z.string().email().optional().or(z.literal(""))
  })
  .superRefine((values, ctx) => {
    if (values.NODE_ENV !== "test" && !values.MONGO_URI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["MONGO_URI"],
        message: "MONGO_URI is required"
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment variables: ${JSON.stringify(formatted)}`);
}

export const env = parsed.data;
export type Env = typeof env;
