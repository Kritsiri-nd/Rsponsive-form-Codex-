'use client'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const p = useSearchParams()

  const correct = Number(p.get('score'))
  const total = Number(p.get('total'))
  const percent = Number(p.get('percent')).toFixed(1)

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow text-center mt-10">
      <h1 className="text-3xl font-bold text-green-600">✅ ผ่านการทดสอบ!</h1>

      <p className="mt-4 text-xl font-medium">
        คะแนน {correct} / {total} ({percent}%)
      </p>

      <p className="mt-3 text-gray-600">
        ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว
      </p>
    </div>
  )
}
