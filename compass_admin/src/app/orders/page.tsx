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
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  Textarea,
  useToast,
  AlertModal,
  LoadingSkeleton
} from "@compass/ui";

import { PageHeader } from "../../components/ui/PageHeader";
import {
  createOrder,
  createPayment,
  deleteOrder,
  fetchOrders,
  fetchPayments,
  fetchSettings,
  updateOrder
} from "../../lib/api";
import { orders as fallbackOrders } from "../../lib/mock-data";
import type { Order, Payment } from "../../lib/types";

const schema = z.object({
  client: z.string().min(2),
  project: z.string().min(2),
  total: z.coerce.number().min(500),
  status: z.enum(["pending", "in-progress", "completed"]),
  dueDate: z.string().min(1),
  paidAmount: z.coerce.number().min(0)
});

type FormValues = z.infer<typeof schema>;

export default function OrdersPage() {
  const [items, setItems] = React.useState<Order[]>([]);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<Order | null>(null);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentOrder, setPaymentOrder] = React.useState<Order | null>(null);
  const [minDepositPercent, setMinDepositPercent] = React.useState(20);
  const [saving, setSaving] = React.useState(false);
  const [savingPayment, setSavingPayment] = React.useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const paymentSchema = z.object({
    amount: z.coerce.number().min(1),
    status: z.enum(["pending", "paid", "failed"]),
    method: z.string().optional(),
    paidAt: z.string().optional(),
    note: z.string().optional()
  });

  type PaymentFormValues = z.infer<typeof paymentSchema>;

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { status: "paid" }
  });

  React.useEffect(() => {
    Promise.all([
      fetchOrders().then(setItems),
      fetchPayments().then(setPayments).catch(() => setPayments([])),
      fetchSettings()
        .then((data) => setMinDepositPercent(data.minDepositPercent ?? 20))
        .catch(() => undefined)
    ]).finally(() => setIsLoading(false));
  }, []);

  const getPaidTotal = React.useCallback(
    (orderId: string) =>
      payments
        .filter((payment) => payment.orderId === orderId && payment.status === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments]
  );

  const getPendingTotal = React.useCallback(
    (orderId: string) =>
      payments
        .filter((payment) => payment.orderId === orderId && payment.status === "pending")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments]
  );

  const openCreate = () => {
    setEditingOrder(null);
    reset({
      client: "",
      project: "",
      total: 0,
      status: "pending",
      dueDate: "",
      paidAmount: 0
    });
    setOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    reset({
      client: order.client,
      project: order.project,
      total: order.total,
      status: order.status,
      dueDate: order.dueDate,
      paidAmount: 0
    });
    setOpen(true);
  };

  const openPayment = (order: Order) => {
    setPaymentOrder(order);
    paymentForm.reset({
      amount: order.total,
      status: "paid",
      method: "",
      paidAt: new Date().toISOString().slice(0, 10),
      note: ""
    });
    setPaymentOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const { paidAmount, ...orderPayload } = values;
      if (editingOrder) {
        const updated = await updateOrder(editingOrder.id, orderPayload);
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "Order updated", description: "Changes saved successfully.", variant: "success" });
      } else {
        const order = await createOrder(orderPayload);
        setItems((prev) => [order, ...prev]);
        if (paidAmount > 0) {
          const payment = await createPayment({
            orderId: order.id,
            amount: paidAmount,
            status: "paid",
            paidAt: new Date().toISOString().slice(0, 10)
          });
          setPayments((prev) => [payment, ...prev]);
          if (paidAmount >= order.total) {
            const updated = await updateOrder(order.id, { status: "completed" });
            setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
          }
        }
        toast({ title: "Order created", description: "The order was saved successfully.", variant: "success" });
      }
      reset();
      setOpen(false);
      setEditingOrder(null);
    } catch (error) {
      toast({
        title: editingOrder ? "Unable to update order" : "Unable to create order",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    const previous = items;
    setItems((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    try {
      await updateOrder(orderId, { status });
      toast({ title: "Order updated", description: "Status updated successfully.", variant: "success" });
    } catch (error) {
      setItems(previous);
      toast({
        title: "Unable to update order",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const onPaymentSubmit = async (values: PaymentFormValues) => {
    if (!paymentOrder) return;
    setSavingPayment(true);
    try {
      const payload = {
        orderId: paymentOrder.id,
        amount: values.amount,
        status: values.status,
        method: values.method || undefined,
        paidAt: values.paidAt || undefined,
        note: values.note || undefined
      };
      const payment = await createPayment(payload);
      setPayments((prev) => [payment, ...prev]);
      const totalPaid = getPaidTotal(paymentOrder.id) + (payment.status === "paid" ? payment.amount : 0);
      if (totalPaid >= paymentOrder.total) {
        const updated = await updateOrder(paymentOrder.id, { status: "completed" });
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      }
      toast({ title: "Payment recorded", description: "The payment was saved successfully.", variant: "success" });
      setPaymentOpen(false);
      setPaymentOrder(null);
    } catch (error) {
      toast({
        title: "Unable to add payment",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    console.log("handleConfirmDelete called for Order ID:", id);
    try {
      setDeleting(true);
      await deleteOrder(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setPayments((prev) => prev.filter((payment) => payment.orderId !== id));
      toast({ title: "Order deleted", description: "The order was removed.", variant: "success" });
    } catch (error) {
      console.error("Delete order failed:", error);
      toast({
        title: "Unable to delete order",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
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
        title="Orders"
        description="Track deposits, milestones, and delivery timelines."
        actionLabel="New order"
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
            title="No orders yet"
            description="Create the first order to start tracking delivery."
            actionLabel="New order"
            onAction={() => setOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>
                  <Tooltip content={`Suggested minimum deposit is ${minDepositPercent}% of total.`}>
                    Deposit ({minDepositPercent}%)
                  </Tooltip>
                </TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-text">{order.client}</TableCell>
                  <TableCell>{order.project}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "success"
                          : order.status === "in-progress"
                            ? "warning"
                            : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>${((order.total * minDepositPercent) / 100).toLocaleString()}</TableCell>
                  <TableCell>${getPaidTotal(order.id).toLocaleString()}</TableCell>
                  <TableCell>${getPendingTotal(order.id).toLocaleString()}</TableCell>
                  <TableCell>${Math.max(order.total - getPaidTotal(order.id), 0).toLocaleString()}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(order)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openPayment(order)}>
                      Add payment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text/40 hover:text-danger"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      <Trash2 size={16} className="pointer-events-none" />
                    </Button>
                    <Select
                      value={order.status}
                      options={[
                        { label: "Pending", value: "pending" },
                        { label: "In progress", value: "in-progress" },
                        { label: "Completed", value: "completed" }
                      ]}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value as Order["status"])
                      }
                      className="h-9"
                    />
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
          setEditingOrder(null);
        }}
        title={editingOrder ? "Edit order" : "Create order"}
      >
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Client" error={errors.client?.message} {...register("client")} />
          <Input label="Project" error={errors.project?.message} {...register("project")} />
          <Input
            label="Total value"
            type="number"
            error={errors.total?.message}
            {...register("total")}
          />
          {!editingOrder ? (
            <Input
              label="Paid amount (initial)"
              type="number"
              error={errors.paidAmount?.message}
              helperText={`You can collect any amount. Minimum suggested is ${minDepositPercent}% of total.`}
              {...register("paidAmount")}
            />
          ) : null}
          <Select
            label="Status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "In progress", value: "in-progress" },
              { label: "Completed", value: "completed" }
            ]}
            {...register("status")}
          />
          <Input label="Due date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
          <Button type="submit" className="mt-2" isLoading={saving}>
            {editingOrder ? "Update order" : "Save order"}
          </Button>
        </form>
      </Drawer>

      <Drawer
        isOpen={paymentOpen}
        onClose={() => {
          setPaymentOpen(false);
          setPaymentOrder(null);
        }}
        title={paymentOrder ? `Add payment · ${paymentOrder.client}` : "Add payment"}
      >
        <form className="grid gap-4" onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
          <Input
            label="Amount"
            type="number"
            error={paymentForm.formState.errors.amount?.message}
            {...paymentForm.register("amount")}
          />
          <Select
            label="Status"
            options={[
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" }
            ]}
            {...paymentForm.register("status")}
          />
          <Input
            label="Payment method"
            error={paymentForm.formState.errors.method?.message}
            {...paymentForm.register("method")}
          />
          <Input
            label="Paid at"
            type="date"
            error={paymentForm.formState.errors.paidAt?.message}
            {...paymentForm.register("paidAt")}
          />
          <Input
            label="Note"
            error={paymentForm.formState.errors.note?.message}
            {...paymentForm.register("note")}
          />
          <Button type="submit" isLoading={savingPayment}>
            Save payment
          </Button>
        </form>
      </Drawer>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}

