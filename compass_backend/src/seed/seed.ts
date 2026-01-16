import bcrypt from "bcryptjs";

import { env } from "../config/env.js";
import {
  CalendarEventModel,
  ExpenseModel,
  LeadModel,
  OrderModel,
  PackageModel,
  ProjectModel,
  ReviewModel,
  ServiceModel,
  SettingModel,
  UserModel
} from "../models/index.js";
import {
  seedCalendar,
  seedExpenses,
  seedLeads,
  seedOrders,
  seedPackages,
  seedProjects,
  seedReviews,
  seedServices
} from "./seedData.js";

async function ensureUser(name: string, email: string, password: string, role: "admin" | "editor" | "moderator") {
  const existing = await UserModel.findOne({ email });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.create({ name, email, passwordHash, role });
}

export async function seedDefaults() {
  const [serviceCount, projectCount, packageCount, reviewCount, leadCount, orderCount, expenseCount, calendarCount] =
    await Promise.all([
      ServiceModel.countDocuments(),
      ProjectModel.countDocuments(),
      PackageModel.countDocuments(),
      ReviewModel.countDocuments(),
      LeadModel.countDocuments(),
      OrderModel.countDocuments(),
      ExpenseModel.countDocuments(),
      CalendarEventModel.countDocuments()
    ]);

  // if (serviceCount === 0) await ServiceModel.insertMany(seedServices);
  // if (projectCount === 0) await ProjectModel.insertMany(seedProjects);
  // if (packageCount === 0) await PackageModel.insertMany(seedPackages);
  // if (reviewCount === 0) await ReviewModel.insertMany(seedReviews);
  // if (leadCount === 0) await LeadModel.insertMany(seedLeads);
  // if (orderCount === 0) await OrderModel.insertMany(seedOrders);
  // if (expenseCount === 0) await ExpenseModel.insertMany(seedExpenses);
  // if (calendarCount === 0) await CalendarEventModel.insertMany(seedCalendar);

  const settingsCount = await SettingModel.countDocuments();
  if (settingsCount === 0) {
    await SettingModel.create({ minDepositPercent: env.MIN_DEPOSIT_PERCENT, featureFlags: {} });
  }
}

export async function seedUsers() {
  await ensureUser("Compass Admin", env.ADMIN_EMAIL, env.ADMIN_PASSWORD, "admin");
  await ensureUser("Compass Editor", "editor@compass.test", "editor123", "editor");
  await ensureUser("Compass Moderator", "moderator@compass.test", "moderator123", "moderator");
}
