"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Trash2, Edit } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  Drawer,
  EmptyState,
  FileUpload,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  useToast,
  AlertModal,
  LoadingSkeleton
} from "@compass/ui";

import { PageHeader } from "../../components/ui/PageHeader";
import { createProject, deleteProject, fetchProjects, uploadAdminFile, updateProject } from "../../lib/api";
import { projects as fallbackProjects } from "../../lib/mock-data";
import type { Project } from "../../lib/types";

const schema = z.object({
  nameAr: z.string().min(2, "Arabic Name is required"),
  nameEn: z.string().min(2, "English Name is required"),
  categoryAr: z.string().optional(),
  categoryEn: z.string().optional(),
  summaryAr: z.string().min(10, "Arabic Summary must be at least 10 characters").optional(),
  summaryEn: z.string().min(10, "English Summary must be at least 10 characters").optional(),
  resultsAr: z.string().optional(),
  resultsEn: z.string().optional(),
  roleAr: z.string().optional(),
  roleEn: z.string().optional(),
  outcomeAr: z.string().optional(),
  outcomeEn: z.string().optional(),
  owner: z.string().optional(),
  status: z.enum(["active", "paused", "complete"])
});

type FormValues = z.infer<typeof schema>;

export default function ProjectsPage() {
  const [items, setItems] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = React.useState<File[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    fetchProjects()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      let coverUrl: string | undefined;
      const imageUrls: string[] = [];

      // 1. Upload Cover Image (only if new file selected)
      if (coverFile) {
        const upload = await uploadAdminFile(coverFile);
        coverUrl = upload.url;
      }

      // 2. Upload Gallery Images (only if new files selected)
      for (const file of galleryFiles) {
        const upload = await uploadAdminFile(file);
        imageUrls.push(upload.url);
      }

      const payload = {
        title: values.nameEn,
        titleAr: values.nameAr,
        titleEn: values.nameEn,
        name: values.nameEn,
        nameAr: values.nameAr,
        nameEn: values.nameEn,
        categoryAr: values.categoryAr || undefined,
        categoryEn: values.categoryEn || undefined,
        summaryAr: values.summaryAr || undefined,
        summaryEn: values.summaryEn || undefined,
        resultsAr: values.resultsAr ? values.resultsAr.split(",").map((i) => i.trim()).filter(Boolean) : undefined,
        resultsEn: values.resultsEn ? values.resultsEn.split(",").map((i) => i.trim()).filter(Boolean) : undefined,
        roleAr: values.roleAr || undefined,
        roleEn: values.roleEn || undefined,
        outcomeAr: values.outcomeAr || undefined,
        outcomeEn: values.outcomeEn || undefined,
        owner: values.owner || undefined,
        status: values.status,
        ...(coverUrl && { coverUrl }),
        ...(imageUrls.length > 0 && { images: imageUrls })
      };

      if (editingId) {
        const project = await updateProject(editingId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingId ? project : item)));
        toast({ title: "Project updated", description: "All changes have been saved.", variant: "success" });
      } else {
        const project = await createProject(payload as any);
        setItems((prev) => [project, ...prev]);
        toast({ title: "Project created", description: "The project is now active.", variant: "success" });
      }

      reset();
      setCoverFile(null);
      setGalleryFiles([]);
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: editingId ? "Update failed" : "Creation failed",
        description: error instanceof Error ? error.message : "Request failed.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    try {
      setSaving(true);
      await deleteProject(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Project deleted", description: "The project has been removed.", variant: "success" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete project.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  const statusColors = {
    active: "bg-[rgb(var(--color-success))] shadow-[0_0_12px_rgba(var(--color-success),0.5)]",
    paused: "bg-[rgb(var(--color-warning))] shadow-[0_0_12px_rgba(var(--color-warning),0.5)]",
    complete: "bg-[rgb(var(--color-accent-from))] shadow-[0_0_12px_rgba(var(--color-accent-from),0.5)]"
  };

  const openCreate = () => {
    setEditingId(null);
    reset({
      nameAr: "",
      nameEn: "",
      categoryAr: "",
      categoryEn: "",
      summaryAr: "",
      summaryEn: "",
      roleAr: "",
      roleEn: "",
      outcomeAr: "",
      outcomeEn: "",
      resultsAr: "",
      resultsEn: "",
      owner: "",
      status: "active"
    });
    setOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    reset({
      nameAr: project.nameAr || "",
      nameEn: project.nameEn || project.name || project.title || "",
      categoryAr: project.categoryAr || "",
      categoryEn: project.categoryEn || project.category || "",
      summaryAr: project.summaryAr || "",
      summaryEn: project.summaryEn || project.summary || "",
      roleAr: project.roleAr || project.role || "",
      roleEn: project.roleEn || project.role || "",
      outcomeAr: project.outcomeAr || project.outcome || "",
      outcomeEn: project.outcomeEn || project.outcome || "",
      resultsAr: project.resultsAr?.join(", ") || project.results?.join(", ") || "",
      resultsEn: project.resultsEn?.join(", ") || project.results?.join(", ") || "",
      owner: project.owner || "",
      status: (project.status as any) || "active"
    });
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Showcase your best work in a visual-first bento layout."
        actionLabel="New project"
        onAction={openCreate}
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <LoadingSkeleton className="h-80 rounded-3xl" />
          <LoadingSkeleton className="h-80 rounded-3xl" />
          <LoadingSkeleton className="h-80 rounded-3xl" />
        </div>
      ) : items.length === 0 ? (
        <Card className="flex min-h-[400px] flex-col items-center justify-center border-dashed p-8 text-center bg-card/50 backdrop-blur-sm">
          <EmptyState
            title="No projects yet"
            description="Start by adding your first project to your portfolio."
            actionLabel="Add project"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[200px] gap-6">
          {items.map((project, index) => {
            // Dynamic bento sizing logic
            const isLarge = index % 5 === 0;
            const isWide = index % 5 === 1;
            const isTall = index % 5 === 2;

            return (
              <div
                key={project.id}
                className={`group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-brand/40 hover:shadow-2xl ${isLarge ? "lg:col-span-4 lg:row-span-2" :
                  isWide ? "lg:col-span-2 lg:row-span-1" :
                    isTall ? "lg:col-span-2 lg:row-span-2" :
                      "lg:col-span-2 lg:row-span-1"
                  }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: project.coverUrl ? `url(${project.coverUrl})` : "none",
                    backgroundColor: !project.coverUrl ? "rgba(var(--color-accent-from), 0.05)" : "transparent"
                  }}
                >
                  {!project.coverUrl && (
                    <div className="flex h-full w-full items-center justify-center opacity-20 grayscale">
                      <span className="text-4xl font-bold tracking-tighter uppercase italic opacity-10">Compass</span>
                    </div>
                  )}
                  {/* Darkening Overlays */}
                  <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${statusColors[project.status as keyof typeof statusColors] || statusColors.active}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text/60">{project.status}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 p-0 text-text/40 hover:text-accent-to hover:bg-accent-to/10 bg-background/50 backdrop-blur-sm"
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 p-0 text-text/40 hover:text-danger hover:bg-danger/10 bg-background/50 backdrop-blur-sm"
                        onClick={() => handleDeleteClick(project.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-text mb-1 line-clamp-1">
                    {project.nameEn || project.name || project.title}
                  </h3>
                  {project.nameAr && (
                    <p className="text-[10px] font-bold text-accent-from mb-2 dir-rtl">
                      {project.nameAr}
                    </p>
                  )}
                  <p className="text-xs text-text/70 line-clamp-2 transition-all duration-500 group-hover:line-clamp-none max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mb-2 italic">
                    {project.summaryEn || project.summary}
                  </p>
                  {project.category && (
                    <div className="mt-2 flex">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 bg-background/30 backdrop-blur-md text-text/80">{project.category}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setCoverFile(null);
          setGalleryFiles([]);
        }}
        title={editingId ? "Edit project" : "Create project"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[85vh] overflow-y-auto px-1">
          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-from" />
                Cover Image (الغلاف)
              </label>
              <FileUpload
                label="Single main image"
                accept="image/*"
                onFilesChange={(files) => setCoverFile(files[0])}
              />
              <p className="text-[10px] text-text/50">هذه الصورة التي تظهر في الواجهة الرئيسية (Bento Grid).</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-to" />
                Project Gallery (معرض الصور)
              </label>
              <FileUpload
                label="Multiple additional images"
                accept="image/*"
                multiple
                onFilesChange={(files) => setGalleryFiles(Array.from(files))}
              />
              <p className="text-[10px] text-text/50">الصور الإضافية التي ستظهر داخل صفحة تفاصيل المشروع.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Arabic Fields */}
            <div className="space-y-4 p-5 rounded-3xl bg-[rgb(var(--color-accent-from))]/5 border border-[rgb(var(--color-accent-from))]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-accent-from" />
                <h3 className="font-display font-bold text-accent-from uppercase tracking-wider text-xs">Arabic Content (AR)</h3>
              </div>
              <Input label="اسم المشروع" {...register("nameAr")} error={errors.nameAr?.message} />
              <Input label="القسم" {...register("categoryAr")} />
              <Textarea label="الملخص" {...register("summaryAr")} error={errors.summaryAr?.message} />
              <Input label="الدور" {...register("roleAr")} />
              <Input label="النتيجة" {...register("outcomeAr")} />
              <Textarea label="النتائج (مفصولة بفاصلة)" {...register("resultsAr")} />
            </div>

            {/* English Fields */}
            <div className="space-y-4 p-5 rounded-3xl bg-[rgb(var(--color-accent-to))]/5 border border-[rgb(var(--color-accent-to))]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-accent-to" />
                <h3 className="font-display font-bold text-accent-to uppercase tracking-wider text-xs">English Content (EN)</h3>
              </div>
              <Input label="Project Name" {...register("nameEn")} error={errors.nameEn?.message} />
              <Input label="Category" {...register("categoryEn")} />
              <Textarea label="Summary" {...register("summaryEn")} error={errors.summaryEn?.message} />
              <Input label="Role" {...register("roleEn")} />
              <Input label="Outcome" {...register("outcomeEn")} />
              <Textarea label="Results (comma separated)" {...register("resultsEn")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Owner" {...register("owner")} />
            <Select
              label="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
                { label: "Complete", value: "complete" }
              ]}
              {...register("status")}
            />
          </div>

          <Button type="submit" className="w-full h-12 shadow-xl shadow-accent-from/20" isLoading={saving}>
            {editingId ? "Save Changes" : "Create Project"}
          </Button>
        </form>
      </Drawer>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={saving}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div >
  );
}
