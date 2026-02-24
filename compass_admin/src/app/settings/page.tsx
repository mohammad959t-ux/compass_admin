"use client";

import * as React from "react";

import { Button, Card, FileUpload, Input, Switch, useToast } from "@compass/ui";

import { RoleGate } from "../../components/shell/Protected";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchSettings, updateSettings, uploadAdminFile } from "../../lib/api";
import type { Settings } from "../../lib/types";

const flagLabels = {
  analyticsSync: {
    title: "Enable analytics sync",
    description: "Sync dashboard metrics with the API nightly."
  },
  twoStepApprovals: {
    title: "Require 2-step approvals",
    description: "Enable for expenses above $5,000."
  },
  leadAlerts: {
    title: "Notify on new leads",
    description: "Send Slack notifications for inbound leads."
  }
} as const;

const serviceCategoryOptions = [
  { id: "branding", label: "Branding" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "web-development", label: "Web Development" },
  { id: "applications", label: "Applications" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "media-production", label: "Media Production" }
] as const;

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [minDeposit, setMinDeposit] = React.useState("");
  const [categoryCovers, setCategoryCovers] = React.useState<Record<string, string>>({});
  const [uploadingCategory, setUploadingCategory] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchSettings()
      .then((data) => {
        setSettings(data);
        setMinDeposit(String(data.minDepositPercent ?? 20));
        setCategoryCovers(data.serviceCategoryCovers ?? {});
      })
      .catch(() => setSettings(null));
  }, []);

  const handleToggle = async (key: keyof Settings["featureFlags"], value: boolean) => {
    if (!settings) return;
    const previous = settings;
    const updated = {
      ...settings,
      featureFlags: {
        ...(settings.featureFlags ?? {}),
        [key]: value
      }
    };
    setSettings(updated);
    try {
      await updateSettings({ featureFlags: updated.featureFlags });
      toast({ title: "Settings updated", description: "Feature flag saved.", variant: "success" });
    } catch (error) {
      setSettings(previous);
      toast({
        title: "Unable to update settings",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const handleMinDepositBlur = async () => {
    if (!settings) return;
    const value = Number(minDeposit);
    if (Number.isNaN(value)) return;
    const previous = settings;
    const updated = { ...settings, minDepositPercent: value };
    setSettings(updated);
    try {
      await updateSettings({ minDepositPercent: value });
      toast({ title: "Settings updated", description: "Deposit percent saved.", variant: "success" });
    } catch (error) {
      setSettings(previous);
      toast({
        title: "Unable to update settings",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const handleCategoryUpload = async (categoryId: string, file?: File | null) => {
    if (!settings || !file) return;
    const previous = { ...categoryCovers };
    setUploadingCategory(categoryId);
    try {
      const upload = await uploadAdminFile(file);
      const nextCovers = { ...previous, [categoryId]: upload.url };
      setCategoryCovers(nextCovers);
      setSettings({ ...settings, serviceCategoryCovers: nextCovers });
      await updateSettings({ serviceCategoryCovers: nextCovers });
      toast({ title: "Category cover updated", description: "Image saved successfully.", variant: "success" });
    } catch (error) {
      setCategoryCovers(previous);
      setSettings({ ...settings, serviceCategoryCovers: previous });
      toast({
        title: "Unable to upload cover",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleCategoryRemove = async (categoryId: string) => {
    if (!settings) return;
    const previous = { ...categoryCovers };
    if (!previous[categoryId]) return;
    const nextCovers = { ...previous };
    delete nextCovers[categoryId];
    setCategoryCovers(nextCovers);
    setSettings({ ...settings, serviceCategoryCovers: nextCovers });
    try {
      await updateSettings({ serviceCategoryCovers: nextCovers });
      toast({ title: "Category cover removed", description: "Image cleared successfully.", variant: "success" });
    } catch (error) {
      setCategoryCovers(previous);
      setSettings({ ...settings, serviceCategoryCovers: previous });
      toast({
        title: "Unable to remove cover",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  return (
    <RoleGate allow={["admin"]}>
      <div className="space-y-6">
        <PageHeader title="Settings" description="Global admin preferences and policies." />
        <Card className="space-y-6">
          <Input
            label="Minimum deposit percent"
            type="number"
            value={minDeposit}
            onChange={(event) => setMinDeposit(event.target.value)}
            onBlur={handleMinDepositBlur}
          />
          {Object.entries(flagLabels).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text">{value.title}</p>
                <p className="text-xs text-text/60">{value.description}</p>
              </div>
              <Switch
                checked={Boolean(settings?.featureFlags?.[key])}
                onCheckedChange={(checked) =>
                  handleToggle(key as keyof Settings["featureFlags"], checked)
                }
              />
            </div>
          ))}
        </Card>
        <Card className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text">Service category covers</p>
            <p className="text-xs text-text/60">
              Upload one image per category to keep the services page consistent.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {serviceCategoryOptions.map((category) => {
              const coverUrl = categoryCovers[category.id];
              return (
                <div
                  key={category.id}
                  className="space-y-3 rounded-xl border border-border/70 bg-card/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-text">{category.label}</p>
                    {coverUrl ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCategoryRemove(category.id)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="relative h-24 overflow-hidden rounded-lg border border-border/70 bg-muted/60">
                    {coverUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverUrl})` }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-text/60">
                        No image yet
                      </div>
                    )}
                  </div>
                  <FileUpload
                    label={`Upload ${category.label} cover`}
                    accept="image/*"
                    onFilesChange={(files) => handleCategoryUpload(category.id, files?.[0])}
                  />
                  {uploadingCategory === category.id ? (
                    <p className="text-xs text-text/60">Uploading...</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </RoleGate>
  );
}
