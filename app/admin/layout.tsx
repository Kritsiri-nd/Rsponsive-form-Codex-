import type { Metadata } from 'next'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin – Responsive Form Demo',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-slate-900">
      <div className="admin-shell mx-auto max-w-7xl">
        <AdminSidebar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}


