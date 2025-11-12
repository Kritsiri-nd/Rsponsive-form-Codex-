'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { OptionsEditor } from '@/components/questions/OptionsEditor'

type QuestionRecord = {
  id: string
  question: string
  options: string[]
  correct_index: number
}

const emptyOptions = ['', '', '', '']

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRecord[]>([])
  const [loading, setLoading] = useState(true)

  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState([...emptyOptions])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editOptions, setEditOptions] = useState([...emptyOptions])
  const [editCorrectIndex, setEditCorrectIndex] = useState(0)
  const [updating, setUpdating] = useState(false)

  const loadQuestions = useCallback(async () => {
    startTransition(() => setLoading(true))
    const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    startTransition(() => {
      setQuestions((data || []) as QuestionRecord[])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const totalQuestions = useMemo(() => questions.length, [questions])

  function resetCreateForm() {
    setQuestionText('')
    setOptions([...emptyOptions])
    setCorrectIndex(0)
  }

  function handleOptionChange(index: number, value: string) {
    setOptions((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleEditOptionChange(index: number, value: string) {
    setEditOptions((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  async function handleCreate() {
    const trimmedQuestion = questionText.trim()
    if (!trimmedQuestion) return alert('กรุณากรอกคำถาม')

    const cleanOptions = sanitizeOptions(options)
    if (cleanOptions.length < 2) return alert('ตัวเลือกต้องอย่างน้อย 2 ตัวเลือก')
    if (correctIndex < 0 || correctIndex >= cleanOptions.length) return alert('โปรดเลือกคำตอบที่ถูกต้อง')

    setCreating(true)
    const { error } = await supabase
      .from('questions')
      .insert({ question: trimmedQuestion, options: cleanOptions, correct_index: correctIndex })
    setCreating(false)

    if (error) {
      alert(error.message)
      return
    }

    resetCreateForm()
    loadQuestions()
  }

  function beginEdit(question: QuestionRecord) {
    setEditingId(question.id)
    setEditQuestion(question.question)
    setEditOptions([...question.options, ...emptyOptions].slice(0, 4))
    setEditCorrectIndex(Number(question.correct_index) || 0)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleUpdate(id: string) {
    const trimmedQuestion = editQuestion.trim()
    if (!trimmedQuestion) return alert('กรุณากรอกคำถาม')

    const cleanOptions = sanitizeOptions(editOptions)
    if (cleanOptions.length < 2) return alert('ตัวเลือกต้องอย่างน้อย 2 ตัวเลือก')
    if (editCorrectIndex < 0 || editCorrectIndex >= cleanOptions.length) return alert('โปรดเลือกคำตอบที่ถูกต้อง')

    setUpdating(true)
    const { error } = await supabase
      .from('questions')
      .update({ question: trimmedQuestion, options: cleanOptions, correct_index: editCorrectIndex })
      .eq('id', id)
    setUpdating(false)

    if (error) {
      alert(error.message)
      return
    }

    setEditingId(null)
    loadQuestions()
  }

  async function handleDelete(id: string) {
    if (!confirm('ยืนยันการลบข้อสอบนี้?')) return
    await supabase.from('questions').delete().eq('id', id)
    loadQuestions()
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">จัดการข้อสอบความปลอดภัย</h1>
        <p className="text-sm text-slate-500">เพิ่มและปรับปรุงข้อสอบสำหรับใช้ในแบบทดสอบผู้รับเหมา</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>เพิ่มข้อสอบใหม่</CardTitle>
          <CardDescription>
            กำหนดคำถาม ตัวเลือก และคำตอบที่ถูกต้อง ข้อสอบทั้งหมด {totalQuestions} ข้อ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600">คำถาม</label>
            <Input value={questionText} onChange={(event) => setQuestionText(event.target.value)} placeholder="ใส่คำถาม" />
          </div>

          <OptionsEditor
            name="create-options"
            options={options}
            correctIndex={correctIndex}
            onOptionChange={handleOptionChange}
            onCorrectChange={setCorrectIndex}
          />

          <div className="flex justify-end">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'กำลังบันทึก...' : 'เพิ่มข้อสอบ'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการข้อสอบทั้งหมด</CardTitle>
          <CardDescription>แก้ไขหรือลบข้อสอบที่มีอยู่ เพื่อให้เนื้อหาทันสมัย</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">กำลังโหลดข้อมูล...</p>
          ) : questions.length === 0 ? (
            <p className="text-sm text-slate-500">ยังไม่มีข้อสอบ</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((question) => (
                <li key={question.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  {editingId === question.id ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">คำถาม</label>
                        <Input value={editQuestion} onChange={(event) => setEditQuestion(event.target.value)} />
                      </div>

                      <OptionsEditor
                        name={`edit-${question.id}`}
                        options={editOptions}
                        correctIndex={editCorrectIndex}
                        onOptionChange={handleEditOptionChange}
                        onCorrectChange={setEditCorrectIndex}
                      />

                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleUpdate(question.id)} disabled={updating}>
                          {updating ? 'กำลังบันทึก...' : 'บันทึก' }
                        </Button>
                        <Button variant="ghost" onClick={cancelEdit}>
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-semibold text-slate-900">{question.question}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => beginEdit(question)}>
                            แก้ไข
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(question.id)}>
                            ลบ
                          </Button>
                        </div>
                      </div>
                      <ol className="ml-5 list-decimal space-y-1 text-sm text-slate-700">
                        {question.options.map((option, index) => (
                          <li
                            key={index}
                            className={index === question.correct_index ? 'font-semibold text-emerald-600' : ''}
                          >
                            {option}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function sanitizeOptions(options: string[]) {
  return options.map((option) => option.trim()).filter((option) => option.length > 0)
}

