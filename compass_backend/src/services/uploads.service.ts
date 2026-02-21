import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

import { env } from "../config/env.js";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.resolve(backendRoot, env.UPLOADS_DIR);
const normalizedPrefix = env.UPLOADS_URL_PREFIX.replace(/^\/+|\/+$/g, "");
const uploadsEndpoint = `/${normalizedPrefix}`;

export function getUploadsDirectory() {
  return uploadsDir;
}

export function getUploadsEndpoint() {
  return uploadsEndpoint;
}

export async function ensureUploadsDirectory() {
  await fs.mkdir(uploadsDir, { recursive: true });
}

export async function saveUpload(buffer: Buffer, originalName: string) {
  const extension = path.extname(originalName) || ".bin";
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);
  return { fileName };
}
