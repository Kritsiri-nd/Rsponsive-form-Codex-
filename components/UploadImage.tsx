'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function UploadImage({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${crypto.randomUUID()}.${ext}`
      const path = `images/${fileName}`

      const { error: upErr } = await supabase.storage.from('submissions').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from('submissions').getPublicUrl(path)
      onUploaded(pub.publicUrl)
    } catch (err: any) {
      setError(err?.message || 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-600">กำลังอัปโหลด...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}


