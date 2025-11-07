'use client'
import React, { useRef } from 'react'

type Props = {
  full_name: string
  age?: number | null
  company?: string | null
  position?: string | null
  image_url?: string | null
}

export default function PrintCard(props: Props) {
  const { full_name, age, company, position, image_url } = props
  const sectionRef = useRef<HTMLDivElement>(null)

  const onPrint = () => {
    const el = sectionRef.current
    if (!el) {
      window.print()
      return
    }
    el.classList.add('is-printing')
    document.documentElement.classList.add('printing-single')
    const after = () => {
      el.classList.remove('is-printing')
      document.documentElement.classList.remove('printing-single')
      window.removeEventListener('afterprint', after)
    }
    window.addEventListener('afterprint', after)
    setTimeout(() => window.print(), 0)
  }

  return (
    <section ref={sectionRef} className="print-section bg-white rounded-xl shadow p-4 md:p-6 print:shadow-none print:p-0 border border-blue-100">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700">แบบฟอร์มผู้สมัคร</h2>
        <button
          onClick={onPrint}
          className="px-3 py-1.5 rounded-lg btn-primary text-sm print:hidden"
        >
          Print
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
        {image_url ? (
          <img src={image_url} alt={full_name} className="w-40 h-40 object-cover rounded-lg border border-blue-100" />
        ) : (
          <div className="w-40 h-40 bg-blue-50 grid place-items-center rounded-lg border border-blue-100 text-blue-700">ไม่มีรูป</div>
        )}

        <dl className="space-y-2">
          <div>
            <dt className="text-sm text-gray-500">ชื่อ-นามสกุล</dt>
            <dd className="font-medium">{full_name}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">อายุ</dt>
              <dd className="font-medium">{age ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ตำแหน่งงาน</dt>
              <dd className="font-medium">{position ?? '-'}</dd>
            </div>
          </div>
          <div>
            <dt className="text-sm text-gray-500">บริษัท</dt>
            <dd className="font-medium">{company ?? '-'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}


