import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";

import { getCorsOrigins } from "./config/cors.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import reviewLinksRoutes from "./routes/reviewLinks.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { getUploadsDirectory, getUploadsEndpoint } from "./services/uploads.service.js";

export function createApp() {
  const app = express();
  const allowedOrigins = getCorsOrigins();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("CORS blocked"));
        }
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(getUploadsEndpoint(), express.static(getUploadsDirectory()));

  app.use(healthRoutes);
  app.use(authRoutes);
  app.use(publicRoutes);
  app.use(reviewLinksRoutes);
  app.use(adminRoutes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
  });

  app.use(errorHandler);

  return app;
}
