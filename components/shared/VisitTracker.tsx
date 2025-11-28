"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logVisit } from "@/lib/analytics";

export const VisitTracker = () => {
  const path = usePathname();
  useEffect(() => {
    if (path) logVisit(path);
  }, [path]);
  return null;
};
