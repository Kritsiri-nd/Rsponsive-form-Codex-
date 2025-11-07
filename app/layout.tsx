import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Responsive Form Demo',
  description: 'Public form + Admin dashboard with Supabase',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  )
}
