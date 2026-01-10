import { env } from "./env.js";

const localOrigins = ["http://localhost:3000", "http://localhost:3001"];
const productionOrigins = ["https://compassdigitalservices.com", "https://admin.compassdigitalservices.com"];
const defaultOrigins = [...localOrigins, ...productionOrigins];

export function getCorsOrigins() {
  const parsed = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  return Array.from(new Set([...defaultOrigins, ...parsed]));
}
