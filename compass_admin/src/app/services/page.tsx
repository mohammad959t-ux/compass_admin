"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  Drawer,
  EmptyState,
  FileUpload,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
  AlertModal,
  LoadingSkeleton
} from "@compass/ui";

import { PageHeader } from "../../components/ui/PageHeader";
import { createService, deleteService, fetchServices, updateService, uploadAdminFile } from "../../lib/api";
import { services as fallbackServices } from "../../lib/mock-data";
import type { Service } from "../../lib/types";

const schema = z.object({
  name: z.string().min(2),
  category: z.string().min(2)
});

type FormValues = z.infer<typeof schema>;

export default function ServicesPage() {
  const [items, setItems] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    fetchServices()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingService(null);
    reset({ name: "", category: "" });
    setOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    reset({
      name: service.name ?? service.title ?? "",
      category: service.category ?? ""
    });
    setOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      let coverUrl: string | undefined;
      if (selectedFile) {
        const upload = await uploadAdminFile(selectedFile);
        coverUrl = upload.url;
      }
      if (editingService) {
        const updated = await updateService(editingService.id, {
          title: values.name,
          name: values.name,
          category: values.category,
          coverUrl
        });
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "Service updated", description: "Changes saved successfully.", variant: "success" });
      } else {
        const service = await createService({
          title: values.name,
          name: values.name,
          category: values.category,
          coverUrl
        });
        setItems((prev) => [service, ...prev]);
        toast({ title: "Service created", description: "The service is now live.", variant: "success" });
      }
      reset();
      setSelectedFile(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: editingService ? "Unable to update service" : "Unable to create service",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
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
    console.log("handleConfirmDelete called for Service ID:", id);
    try {
      setSaving(true);
      await deleteService(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Service deleted", description: "The service was removed.", variant: "success" });
    } catch (error) {
      console.error("Delete service failed:", error);
      toast({
        title: "Unable to delete service",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage service catalog."
        actionLabel="Add service"
        onAction={openCreate}
      />

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No services yet"
            description="List what you offer to start getting reviews and leads."
            actionLabel="Add service"
            onAction={() => setOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-text">{service.name ?? service.title}</TableCell>
                  <TableCell>{service.category ?? "—"}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(service)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text/40 hover:text-danger"
                      onClick={() => handleDeleteClick(service.id)}
                    >
                      <Trash2 size={16} className="pointer-events-none" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedFile(null);
          setEditingService(null);
        }}
        title={editingService ? "Edit service" : "Add service"}
      >
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Service name" error={errors.name?.message} {...register("name")} />
          <Input label="Category" error={errors.category?.message} {...register("category")} />
          <FileUpload
            label="Service cover"
            accept="image/*"
            onFilesChange={(files) => setSelectedFile(files[0])}
          />
          <Button type="submit" isLoading={saving}>
            {editingService ? "Update service" : "Save service"}
          </Button>
        </form>
      </Drawer>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={saving}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
}

