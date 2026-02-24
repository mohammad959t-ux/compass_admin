"use client";

import { usePathname } from "next/navigation";

import { PageTransition } from "../components/motion/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <PageTransition transitionKey={pathname}>{children}</PageTransition>;
}
