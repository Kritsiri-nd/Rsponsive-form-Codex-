'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { QuestionCard } from '@/components/form/QuestionCard'

type Question = {
  id: string
  question: string
  options: string[]
  correct_index: number
}

type Company = {
  id: string
  full_name: string
  short_name: string
}

const FormSchema = z.object({
  company: z.string().min(1, 'กรุณาเลือกบริษัท'),
  full_name: z.string().min(1, 'กรุณากรอกชื่อ-นามสกุล'),
  citizen_id: z.string().min(1, 'กรุณากรอกเลขบัตรประชาชน'),
})

type FormValues = z.infer<typeof FormSchema>

export default function PublicFormPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: '',
      full_name: '',
      citizen_id: '',
    },
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: questionData }, { data: companyData }] = await Promise.all([
        supabase.from('questions').select('*').order('created_at', { ascending: true }),
        supabase.from('company_master').select('*').order('full_name', { ascending: true }),
      ])

      setQuestions((questionData || []) as Question[])
      setCompanies((companyData || []) as Company[])
      setAnswers(Array(questionData?.length || 0).fill(null))
      setLoading(false)
    }

    load()
  }, [])

  const issuedDate = useMemo(() => formatDate(new Date()), [])
  const expiredDate = useMemo(() => {
    const base = new Date()
    base.setFullYear(base.getFullYear() + 1)
    return formatDate(base)
  }, [])

  async function onSubmit(values: FormValues) {
    if (answers.some((answer) => answer === null)) {
      alert('กรุณาตอบคำถามให้ครบทุกข้อ')
      return
    }

    const { correct, total, percent } = calculateScore(questions, answers)

    if (percent < 80) {
      router.push(`/fail?score=${correct}&total=${total}&percent=${percent}`)
      return
    }

    const selectedCompany = companies.find((company) => company.full_name === values.company)
    const company_short = selectedCompany?.short_name ?? 'XXX'

    const payload = {
      full_name: values.full_name,
      company: values.company,
      company_short,
      department: values.company,
      citizen_id: values.citizen_id,
      score: correct,
      total,
      percent,
      issued_date: issuedDate,
      expired_date: expiredDate,
    }

    setSubmitting(true)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setSubmitting(false)

    if (!response.ok) {
      router.push(`/fail?score=${correct}&total=${total}&percent=${percent}`)
      return
    }

    router.push(`/success?score=${correct}&total=${total}&percent=${percent}`)
  }

  function setAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = optionIndex
      return next
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <SkeletonBlock />
        <SkeletonBlock />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex justify-end">
        <Link
          href="/login"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          เข้าสู่ระบบผู้ดูแล
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">แบบทดสอบความปลอดภัยสำหรับผู้รับเหมา</CardTitle>
          <CardDescription>
            กรอกข้อมูลและตอบคำถามเพื่อรับบัตรอนุญาตทำงาน หากทำคะแนนไม่ต่ำกว่า 80% จะได้รับบัตรทันที
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <section className="grid gap-4 rounded-2xl bg-slate-50/60 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-600">บริษัท*</label>
                <Select {...register('company')}>
                  <option value="">เลือกบริษัท</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.full_name}>
                      {company.full_name} ({company.short_name})
                    </option>
                  ))}
                </Select>
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">ชื่อ-นามสกุล*</label>
                <Input {...register('full_name')} placeholder="กรอกชื่อ-นามสกุล" />
                {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">เลขบัตรประชาชน*</label>
                <Input {...register('citizen_id')} placeholder="กรอกเลขบัตรประชาชน" />
                {errors.citizen_id && <p className="mt-1 text-xs text-red-500">{errors.citizen_id.message}</p>}
              </div>
            </section>

            <section className="space-y-4">
              <header>
                <h2 className="text-lg font-semibold text-slate-900">ตอบคำถามความปลอดภัย ({questions.length} ข้อ)</h2>
                <p className="text-sm text-slate-500">
                  ต้องตอบถูกอย่างน้อย 80% จึงจะผ่านการอบรมและได้รับบัตรอนุญาตทำงาน
                </p>
              </header>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    index={index}
                    question={question.question}
                    options={question.options}
                    value={answers[index]}
                    onChange={(optionIndex) => setAnswer(index, optionIndex)}
                  />
                ))}
              </div>
            </section>

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบทดสอบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateScore(questions: Question[], answers: (number | null)[]) {
  let correct = 0
  const total = questions.length

  answers.forEach((answer, index) => {
    if (answer === questions[index]?.correct_index) {
      correct += 1
    }
  })

  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, total, percent }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function SkeletonBlock() {
  return (
    <div className="animate-pulse space-y-3 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm">
      <div className="h-4 w-1/3 rounded-full bg-slate-200" />
      <div className="h-3 w-2/3 rounded-full bg-slate-100" />
      <div className="h-32 rounded-2xl bg-slate-100" />
    </div>
  )
}
