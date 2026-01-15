import mongoose, { Schema } from "mongoose";

export type ProjectStatus = "active" | "paused" | "complete";

export type Project = {
  slug: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  category?: string;
  categoryAr?: string;
  categoryEn?: string;
  summary?: string;
  summaryAr?: string;
  summaryEn?: string;
  results: string[];
  resultsAr?: string[];
  resultsEn?: string[];
  status?: ProjectStatus;
  owner?: string;
  budget?: number;
  role?: string;
  roleAr?: string;
  roleEn?: string;
  outcome?: string;
  outcomeAr?: string;
  outcomeEn?: string;
  coverUrl?: string;
  images?: string[];
};

const ProjectSchema = new Schema<Project>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleAr: String,
    titleEn: String,
    name: { type: String, required: true },
    nameAr: String,
    nameEn: String,
    category: String,
    categoryAr: String,
    categoryEn: String,
    summary: String,
    summaryAr: String,
    summaryEn: String,
    results: { type: [String], default: [] },
    resultsAr: { type: [String], default: [] },
    resultsEn: { type: [String], default: [] },
    status: { type: String, enum: ["active", "paused", "complete"], default: "active" },
    owner: String,
    budget: Number,
    role: String,
    roleAr: String,
    roleEn: String,
    outcome: String,
    outcomeAr: String,
    outcomeEn: String,
    coverUrl: String,
    images: { type: [String], default: [] }
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

export const ProjectModel = mongoose.model<Project>("Project", ProjectSchema);
