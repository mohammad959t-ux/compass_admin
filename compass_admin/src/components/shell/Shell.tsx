"use client";

import { usePathname } from "next/navigation";

import { Protected } from "./Protected";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login" || pathname === "/login/";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <Protected>
      <div className="admin-shell flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-8 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </Protected>
  );
}
