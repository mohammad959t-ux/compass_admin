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
  Input,
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
import { createExpense, deleteExpense, fetchExpenses } from "../../lib/api";
import { expenses as fallbackExpenses } from "../../lib/mock-data";
import type { Expense } from "../../lib/types";

const schema = z.object({
  vendor: z.string().min(2),
  category: z.string().min(2),
  amount: z.coerce.number().min(1),
  date: z.string().min(1),
  note: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function ExpensesPage() {
  const [items, setItems] = React.useState<Expense[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
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
    fetchExpenses()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const expense = await createExpense(values);
      setItems((prev) => [expense, ...prev]);
      toast({ title: "Expense logged", description: "The expense was saved.", variant: "success" });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Unable to log expense",
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
    console.log("handleConfirmDelete called for Expense ID:", id);
    try {
      setDeleting(true);
      await deleteExpense(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Expense deleted", description: "The expense was removed.", variant: "success" });
    } catch (error) {
      console.error("Delete expense failed:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete expense.",
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
        title="Expenses"
        description="Monitor spend across vendors and tools."
        actionLabel="Log expense"
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
            title="No expenses yet"
            description="Log your first expense to start tracking operational costs."
            actionLabel="New expense"
            onAction={() => setOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]">{null}</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium text-text">{expense.vendor}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text/40 hover:text-danger"
                      onClick={() => handleDeleteClick(expense.id)}
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
      <Drawer isOpen={open} onClose={() => setOpen(false)} title="Log expense">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Vendor" error={errors.vendor?.message} {...register("vendor")} />
          <Input label="Category" error={errors.category?.message} {...register("category")} />
          <Input label="Amount" type="number" error={errors.amount?.message} {...register("amount")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Textarea label="Note" error={errors.note?.message} {...register("note")} />
          <Button type="submit" isLoading={saving}>
            Save expense
          </Button>
        </form>
      </Drawer>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </div>
  );
}

