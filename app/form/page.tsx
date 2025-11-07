'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import UploadImage from '@/components/UploadImage'

const FormSchema = z.object({
  full_name: z.string().min(3, 'กรุณากรอกชื่อ-นามสกุลอย่างน้อย 3 ตัวอักษร'),
  age: z.number().int().min(0).max(120).optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  image_url: z.string().url().optional(),
})

type FormValues = z.infer<typeof FormSchema>

export default function PublicFormPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(FormSchema) })

  async function onSubmit(values: FormValues) {
    const { error } = await supabase.from('submissions').insert(values)
    if (error) {
      alert('บันทึกไม่สำเร็จ: ' + error.message)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-5 md:p-7 border border-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">ฟอร์มสมัคร (ไม่ต้องล็อกอิน)</h1>
      {submitted ? (
        <p className="text-green-700">ส่งข้อมูลเรียบร้อย ขอบคุณ!</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">ชื่อ-นามสกุล *</label>
            <input
              {...register('full_name')}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น กิตติศิริ ใจดี"
            />
            {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">อายุ</label>
            <input
              type="number"
              inputMode="numeric"
              {...register('age', { setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)) })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น 27"
            />
            {errors.age && <p className="text-sm text-red-600">{errors.age.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">บริษัท</label>
              <input {...register('company')} className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm mb-1">ตำแหน่ง</label>
              <input {...register('position')} className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">อัปโหลดรูปภาพ</label>
            <UploadImage onUploaded={(url) => setValue('image_url', url, { shouldValidate: true })} />
            {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message as string}</p>}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg btn-primary py-2.5 font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งแบบฟอร์ม'}
          </button>
        </form>
      )}
    </div>
  )
}


