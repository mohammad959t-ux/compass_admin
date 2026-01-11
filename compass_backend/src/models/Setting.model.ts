import mongoose, { Schema } from "mongoose";

export type Setting = {
  minDepositPercent: number;
  featureFlags: Record<string, boolean>;
  serviceCategoryCovers: Record<string, string>;
};

const SettingSchema = new Schema<Setting>(
  {
    minDepositPercent: { type: Number, required: true, default: 20 },
    featureFlags: { type: Map, of: Boolean, default: {} },
    serviceCategoryCovers: { type: Map, of: String, default: {} }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
      }
    }
  }
);

export const SettingModel = mongoose.model<Setting>("Setting", SettingSchema);
