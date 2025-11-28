import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50">
      <div className="container-page py-8">
        <AdminNav />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
