"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { createApiClient } from "@compass/ui";

export type UserRole = "admin" | "editor" | "moderator";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  credentials: "include"
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const data = await api.get<UserProfile>("/auth/me");
      if (data) setUser(data);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = React.useCallback(async (payload: { email: string; password: string }) => {
    await api.post("/auth/login", payload);
    await refresh();
  }, [refresh]);

  const logout = React.useCallback(async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="grid h-[60vh] place-items-center text-sm text-text/60">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}

export function Protected({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export function RoleGate({
  allow,
  children,
  fallback
}: {
  allow: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return null;
  if (!allow.includes(user.role)) {
    return (
      fallback ?? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-text/70">
          You do not have access to this section.
        </div>
      )
    );
  }
  return <>{children}</>;
}
