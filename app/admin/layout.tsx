import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import AdminSidebar from '@/components/AdminSidebar'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin – Responsive Form Demo',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen text-slate-900">
      <div className="admin-shell mx-auto max-w-7xl">
        <AdminSidebar userEmail={session.user?.email ?? undefined} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}


