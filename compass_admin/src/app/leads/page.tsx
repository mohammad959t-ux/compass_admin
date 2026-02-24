"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  Input,
  Pagination,
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
import { createLead, deleteLead, fetchLeads, updateLead } from "../../lib/api";
import { leads as fallbackLeads } from "../../lib/mock-data";
import type { Lead } from "../../lib/types";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(["new", "contacted", "won", "lost"]),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(5)
});

type FormValues = z.infer<typeof schema>;

export default function LeadsPage() {
  const [items, setItems] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    fetchLeads()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const lead = await createLead(values);
      setItems((prev) => [lead, ...prev]);
      toast({ title: "Lead created", description: "The lead was added successfully.", variant: "success" });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Unable to create lead",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (leadId: string, status: Lead["status"]) => {
    const previous = items;
    setItems((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
    try {
      await updateLead(leadId, { status });
      toast({ title: "Lead updated", description: "Status updated successfully.", variant: "success" });
    } catch (error) {
      setItems(previous);
      toast({
        title: "Unable to update lead",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    console.log("handleConfirmDelete called for Lead ID:", id);
    try {
      setDeleting(true);
      await deleteLead(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Lead deleted", description: "The lead was removed.", variant: "success" });
    } catch (error) {
      console.error("Delete lead failed:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete lead.",
        variant: "danger"
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track inbound demand and funnel stages."
        actionLabel="Add lead"
        onAction={() => setOpen(true)}
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
            title="No leads yet"
            description="New inquiries will appear here as they come in."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead className="w-[50px]">{null}</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {items.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-text">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.status === "won"
                            ? "success"
                            : lead.status === "lost"
                              ? "danger"
                              : lead.status === "contacted"
                                ? "warning"
                                : "default"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.createdAt}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        options={[
                          { label: "New", value: "new" },
                          { label: "Contacted", value: "contacted" },
                          { label: "Won", value: "won" },
                          { label: "Lost", value: "lost" }
                        ]}
                        onChange={(event) =>
                          handleStatusChange(lead.id, event.target.value as Lead["status"])
                        }
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text/40 hover:text-danger"
                        onClick={() => handleDeleteClick(lead.id)}
                      >
                        <Trash2 size={16} className="pointer-events-none" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Pagination page={page} totalPages={3} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <Drawer isOpen={open} onClose={() => setOpen(false)} title="Add lead">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Company" error={errors.company?.message} {...register("company")} />
          <Input label="Budget" error={errors.budget?.message} {...register("budget")} />
          <Select
            label="Status"
            options={[
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Won", value: "won" },
              { label: "Lost", value: "lost" }
            ]}
            {...register("status")}
          />
          <Textarea label="Message" error={errors.message?.message} {...register("message")} />
          <Button type="submit" isLoading={saving}>
            Save lead
          </Button>
        </form>
      </Drawer>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
}

