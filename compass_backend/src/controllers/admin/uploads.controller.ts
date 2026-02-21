import { type Request, type Response } from "express";

import { env } from "../../config/env.js";
import { getUploadsEndpoint, saveUpload } from "../../services/uploads.service.js";

export async function uploadFile(req: Request, res: Response) {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    res.status(400).json({ message: "Missing file" });
    return;
  }

  const { fileName } = await saveUpload(file.buffer, file.originalname ?? "upload-file");
  const host = req.get("host") ?? `localhost:${env.PORT}`;
  const baseUrl = `${req.protocol}://${host}`;
  const url = `${baseUrl}${getUploadsEndpoint()}/${fileName}`;

  res.json({ url, publicId: fileName });
}
