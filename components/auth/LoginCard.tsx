'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function LoginCard() {
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    try {
      setLoading(true)
      await signIn('google', { callbackUrl: '/admin' })
    } catch (error) {
      console.error('Google sign-in failed', error)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-xl backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin Console</p>
        <h1 className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบด้วย Gmail</h1>
        <p className="text-sm text-slate-500">Login เพื่อเข้าจัดการแบบฟอร์มและใบผ่านเข้า</p>
      </div>

      <button
        type="button"
        onClick={handleLogin}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-3 text-base font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path fill="#4285F4" d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.64h6.48a5.54 5.54 0 0 1-2.405 3.63v3.02h3.887c2.277-2.096 3.558-5.186 3.558-8.835Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.957-1.073 7.943-2.892l-3.887-3.02c-1.08.72-2.46 1.148-4.056 1.148-3.12 0-5.76-2.107-6.704-4.946H1.29v3.11A12 12 0 0 0 12 24Z" />
          <path fill="#FABB05" d="M5.296 14.29a7.211 7.211 0 0 1 0-4.58V6.6H1.291a12.004 12.004 0 0 0 0 10.8l4.005-3.11Z" />
          <path fill="#E94235" d="M12 4.708c1.764 0 3.351.607 4.598 1.794l3.447-3.447C17.953 1.164 15.235 0 12 0A12 12 0 0 0 1.291 6.6l4.005 3.11C6.24 6.815 8.88 4.708 12 4.708Z" />
        </svg>
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'Continue with Google'}
      </button>

      <p className="text-xs text-slate-400">
        ระบบจะตรวจสอบสิทธิ์ผ่าน Google Workspace / Gmail และพาคุณไปยังแดชบอร์ด Admin อัตโนมัติ
      </p>
    </div>
  )
}
