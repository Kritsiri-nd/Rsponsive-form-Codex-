import type { Metadata } from 'next'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin – Responsive Form Demo',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-red-900">
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}


