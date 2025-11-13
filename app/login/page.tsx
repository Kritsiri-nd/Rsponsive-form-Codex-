import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { LoginCard } from '@/components/auth/LoginCard'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบผู้ดูแล | Responsive Form',
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/admin')

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <LoginCard />
    </div>
  )
}
