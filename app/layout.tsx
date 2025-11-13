import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Providers } from '@/components/Providers'
import { authOptions } from '@/lib/auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'Responsive Form Demo',
  description: 'Public form + Admin dashboard with Supabase',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="th">
      <body className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 text-slate-900 antialiased">
        <Providers session={session}>
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)]" aria-hidden />
          <main className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
