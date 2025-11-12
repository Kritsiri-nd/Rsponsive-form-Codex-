'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

/* ✅ Schema */
const FormSchema = z.object({
  company: z.string().min(1, 'กรุณาเลือกบริษัท'),
  full_name: z.string().min(1, 'กรุณากรอกชื่อ-นามสกุล'),
  citizen_id: z.string().min(1, 'กรุณากรอกบัตรประชาชน'),
})

type FormValues = z.infer<typeof FormSchema>

export default function PublicFormPage() {
  const router = useRouter()

  const [questions, setQuestions] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(FormSchema) })

  /* ✅ โหลดคำถาม + บริษัท */
  useEffect(() => {
    async function load() {
      const { data: q } = await supabase.from('questions').select('*')
      const { data: c } = await supabase.from('company_master').select('*')

      console.log("✅ โหลด questions:", q)
      console.log("✅ โหลด companies:", c)

      setQuestions(q ?? [])
      setCompanies(c ?? [])
      setAnswers(Array((q ?? []).length).fill(null)) // ตั้งค่า array ให้เท่าข้อสอบ
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="p-6 text-center">กำลังโหลด...</p>

  /* ✅ คำนวณคะแนน (debug ครบ) */
  function getScore() {
    console.log("🟦 เริ่มคำนวณคะแนน ------------------")
    console.log("answers =", answers)
    console.log("correct_index =", questions.map(q => q.correct_index))

    let correct = 0
    const total = questions.length

    for (let i = 0; i < total; i++) {
      const ans = Number(answers[i])
      const correctIndex = Number(questions[i].correct_index)

      console.log(`ข้อที่ ${i + 1} | ตอบ = ${ans} | เฉลย = ${correctIndex}`)

      if (ans === correctIndex) {
        correct++
      }
    }

    const percent = (correct / total) * 100

    console.log("✅ correct =", correct)
    console.log("✅ total =", total)
    console.log("✅ percent =", percent)
    console.log("🟩 จบคำนวณคะแนน ------------------")

    return { correct, total, percent }
  }

  /* ✅ format date */
  function formatDate(date: Date) {
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  const issuedDate = formatDate(new Date())
  const expiredDate = formatDate(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  )

  /* ✅ submit */
  async function onSubmit(values: FormValues) {
    console.log("🟧 เริ่ม submit ------------------")

    // ✅ กันไม่ตอบครบ
    if (answers.some((a) => a === null)) {
      console.log("❌ ยังตอบไม่ครบ answers =", answers)
      alert('กรุณาตอบคำถามให้ครบทุกข้อ')
      return
    }

    const { correct, total, percent } = getScore()

    console.log("🟩 ผลคะแนนหลังคำนวณ =>", { correct, total, percent })

    // ✅ เช็คผ่าน 80%
    if (percent < 80) {
      console.log("❌ ไม่ผ่าน -> redirect fail")
      router.push(`/fail?score=${correct}&total=${total}&percent=${percent}`)
      return
    }

    // ✅ หา company_short
    const selectedCompany = companies.find(
      (c) => c.full_name === values.company
    )
    const company_short = selectedCompany?.short_name ?? 'XXX'

    const payload = {
      full_name: values.full_name,
      company: values.company,
      company_short,
      department: values.company, // ใช้ชื่อบริษัทแทนแผนกตามคำขอ
      citizen_id: values.citizen_id,
      score: correct,
      total,
      percent,
      issued_date: issuedDate,
      expired_date: expiredDate,
    }

    console.log("🟦 Payload ส่งเข้า API =", payload)

    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    console.log("🟦 API result =", res.status)

    if (!res.ok) {
      console.log("❌ API ERROR -> ไป fail")
      router.push(`/fail?score=${correct}&total=${total}&percent=${percent}`)
      return
    }

    console.log("✅ ผ่าน -> redirect success")
    router.push(`/success?score=${correct}&total=${total}&percent=${percent}`)
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 border mt-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        แบบทดสอบความปลอดภัย
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* ✅ ข้อมูลผู้ทำแบบทดสอบ */}
        <section className="space-y-4">
          {/* ✅ Company dropdown */}
          <div>
            <label className="block mb-1">Company *</label>
            <select {...register('company')} className="w-full border rounded px-3 py-2">
              <option value="">เลือกบริษัท</option>
              {companies.map((c) => (
                <option key={c.id} value={c.full_name}>
                  {c.full_name} ({c.short_name})
                </option>
              ))}
            </select>
            {errors.company && <p className="text-red-600">{errors.company.message}</p>}
          </div>

          {/* ✅ Full name */}
          <div>
            <label className="block mb-1">Name Surname *</label>
            <input {...register('full_name')} className="w-full border rounded px-3 py-2" />
            {errors.full_name && <p className="text-red-600">{errors.full_name.message}</p>}
          </div>

          {/* ✅ Citizen ID */}
          <div>
            <label className="block mb-1">Citizen ID *</label>
            <input {...register('citizen_id')} className="w-full border rounded px-3 py-2" />
            {errors.citizen_id && <p className="text-red-600">{errors.citizen_id.message}</p>}
          </div>
        </section>

        {/* ✅ คำถาม */}
        {questions.map((q, i) => (
          <article key={q.id} className="border p-3 rounded-lg bg-blue-50">
            <p className="font-medium">{i + 1}. {q.question}</p>

            {q.options.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  checked={answers[i] === idx}
                  name={`question-${i}`}
                  onChange={() => {
                    const arr = [...answers]
                    arr[i] = idx

                    console.log(`🟨 เลือกคำตอบข้อ ${i + 1} =`, idx)

                    setAnswers(arr)
                  }}
                />
                {opt}
              </label>
            ))}
          </article>
        ))}

        {/* ✅ submit */}
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          ส่งแบบทดสอบ
        </button>

      </form>
    </div>
  )
}
