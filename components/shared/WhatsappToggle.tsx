"use client";

import { usePathname } from "next/navigation";
import { WhatsappFloat } from "./WhatsappFloat";

// Avoids showing floating CTA inside admin.
export const WhatsappToggle = () => {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return <WhatsappFloat />;
};
