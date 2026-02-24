"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, Card, Input, ThemeToggle, useToast } from "@compass/ui";

import { useAuth } from "../../components/shell/Protected";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof schema>;

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      toast({ title: "Welcome back", description: "Redirecting to dashboard.", variant: "success" });
      const next = searchParams.get("next") ?? "/";
      router.replace(next);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Check your credentials and try again.",
        variant: "danger"
      });
    }
  };

  return (
    <Card className="w-full max-w-md space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-text/60">Compass Admin</p>
          <h1 className="font-display text-2xl font-semibold text-text">Sign in</h1>
        </div>
        <ThemeToggle />
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
      <div className="rounded-lg border border-border bg-muted/60 p-3 text-xs text-text/70">
        Use your Compass admin credentials. Session cookies are handled via the API.
      </div>
    </Card>
  );
};

export default function LoginPage() {
  return (
    <div className="auth-screen min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl items-stretch gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between rounded-3xl border border-border/60 bg-card/60 p-10 shadow-card lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text/60">Compass Admin</p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-text">
              Command center for Compass Digital Services.
            </h1>
            <p className="mt-3 text-sm text-text/70">
              Monitor projects, approvals, and client signals in one focused workspace.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-muted/60 p-4 text-sm text-text/80">
              <p className="text-xs uppercase text-text/50">Today</p>
              <p className="mt-2 text-lg font-semibold text-text">3 launches scheduled</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/60 p-4 text-sm text-text/80">
              <p className="text-xs uppercase text-text/50">Pipeline</p>
              <p className="mt-2 text-lg font-semibold text-text">12 active client engagements</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <React.Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
