'use client'
import { useSearchParams } from 'next/navigation'

export default function FailPage() {
  const p = useSearchParams()

  const correct = Number(p.get('score'))
  const total = Number(p.get('total'))
  const percent = Number(p.get('percent')).toFixed(1)

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow text-center mt-10">
      <h1 className="text-3xl font-bold text-red-600">❌ ไม่ผ่านการทดสอบ</h1>

      <p className="mt-4 text-xl font-medium">
        คะแนน {correct} / {total} ({percent}%)
      </p>

      <p className="mt-4 text-gray-600">
        ต้องทำได้อย่างน้อย 80% ขึ้นไป
      </p>

      <a href="/form"
        className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        ทำแบบทดสอบใหม่
      </a>
    </div>
  )
}
