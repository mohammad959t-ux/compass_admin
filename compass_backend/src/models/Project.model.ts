import mongoose, { Schema } from "mongoose";

export type ProjectStatus = "active" | "paused" | "complete";

export type Project = {
  slug: string;
  title: string;
  name: string;
  category?: string;
  summary?: string;
  results: string[];
  status?: ProjectStatus;
  owner?: string;
  budget?: number;
  role?: string;
  outcome?: string;
  coverUrl?: string;
};

const ProjectSchema = new Schema<Project>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    category: String,
    summary: String,
    results: { type: [String], default: [] },
    status: { type: String, enum: ["active", "paused", "complete"], default: "active" },
    owner: String,
    budget: Number,
    role: String,
    outcome: String,
    coverUrl: String
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
