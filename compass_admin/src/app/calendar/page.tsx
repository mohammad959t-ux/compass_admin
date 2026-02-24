"use client";

import * as React from "react";
import Calendar from "react-calendar";
import { useForm } from "react-hook-form";
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
  Textarea,
  useToast
} from "@compass/ui";

import { PageHeader } from "../../components/ui/PageHeader";
import { createCalendarEvent, fetchCalendarEvents } from "../../lib/api";
import type { CalendarEvent } from "../../lib/types";

const schema = z.object({
  title: z.string().min(2),
  date: z.string().min(1),
  type: z.string().optional(),
  status: z.enum(["scheduled", "completed", "canceled"]).optional(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function CalendarPage() {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [selected, setSelected] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    fetchCalendarEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const upcoming = events
    .filter((event) => new Date(event.date) >= new Date(selected.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const event = await createCalendarEvent(values);
      setEvents((prev) => [event, ...prev]);
      toast({ title: "Event added", description: "The calendar event is scheduled.", variant: "success" });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Unable to add event",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Keep track of milestones and client sessions."
        actionLabel="Add event"
        onAction={() => setOpen(true)}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <Calendar onChange={(date) => setSelected(date as Date)} value={selected} />
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="No events"
              description="Add a calendar event to stay on top of milestones."
              actionLabel="Add event"
              onAction={() => setOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div key={event.id} className="rounded-lg border border-border bg-card/70 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {event.type ? <Badge variant="outline">{event.type}</Badge> : null}
                    {event.status ? (
                      <Badge variant={event.status === "completed" ? "success" : "default"}>
                        {event.status}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-text">{event.title}</p>
                  <p className="text-xs text-text/60">{event.date}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Drawer isOpen={open} onClose={() => setOpen(false)} title="Add calendar event">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Input label="Type" error={errors.type?.message} {...register("type")} />
          <Select
            label="Status"
            options={[
              { label: "Scheduled", value: "scheduled" },
              { label: "Completed", value: "completed" },
              { label: "Canceled", value: "canceled" }
            ]}
            {...register("status")}
          />
          <Textarea label="Notes" error={errors.notes?.message} {...register("notes")} />
          <Button type="submit" isLoading={saving}>
            Save event
          </Button>
        </form>
      </Drawer>
    </div>
  );
}

