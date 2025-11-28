"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { isAdminAuthenticated } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === "/admin/login") return;

    // Check if user is authenticated
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // Don't show admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (!isAdminAuthenticated()) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container-page py-8">
        <AdminNav />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
