import { env } from "../config/env.js";
import { SettingModel } from "../models/index.js";

export async function getSettings() {
  let settings = await SettingModel.findOne();
  if (!settings) {
    settings = await SettingModel.create({
      minDepositPercent: env.MIN_DEPOSIT_PERCENT,
      featureFlags: {},
      serviceCategoryCovers: {}
    });
  }
  return settings;
}
