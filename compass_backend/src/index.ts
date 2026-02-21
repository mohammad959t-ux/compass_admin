import "dotenv/config";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./db/mongo.js";
import { seedDefaults, seedUsers } from "./seed/seed.js";
import { ensureUploadsDirectory } from "./services/uploads.service.js";

async function start() {
  await connectMongo();
  await seedUsers();
  await seedDefaults();
  await ensureUploadsDirectory();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Compass API running on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
