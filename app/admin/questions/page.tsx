'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminQuestionsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correct, setCorrect] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // ✅ edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', ''])
  const [editCorrect, setEditCorrect] = useState<number>(0)

  useEffect(() => {
    loadQuestions()
  }, [])

  async function loadQuestions() {
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  async function addQuestion() {
    if (!question.trim()) return alert('กรุณากรอกคำถาม')

    const cleanOptions = options.map((o) => o.trim()).filter((o) => o.length > 0)
    if (cleanOptions.length < 2) return alert('ตัวเลือกต้องอย่างน้อย 2 ตัวเลือก')

    const { error } = await supabase.from('questions').insert({
      question,
      options: cleanOptions,
      correct_index: correct,
    })

    if (error) return alert(error.message)

    setQuestion('')
    setOptions(['', '', '', ''])
    setCorrect(0)
    loadQuestions()
  }

  function beginEdit(q: any) {
    setEditingId(q.id)
    setEditQuestion(q.question || '')
    const base = Array(4).fill('') as string[]
    for (let i = 0; i < Math.min(4, (q.options || []).length); i++) base[i] = q.options[i]
    setEditOptions(base)
    setEditCorrect(Number(q.correct_index || 0))
  }

  async function saveEdit(id: string) {
    if (!editQuestion.trim()) return alert('กรุณากรอกคำถาม')
    const cleanOptions = editOptions.map((o) => o.trim()).filter((o) => o.length > 0)
    if (cleanOptions.length < 2) return alert('ตัวเลือกต้องอย่างน้อย 2 ตัวเลือก')
    if (editCorrect < 0 || editCorrect >= cleanOptions.length) {
      return alert('ตำแหน่งเฉลยไม่ถูกต้อง')
    }

    const { error } = await supabase
      .from('questions')
      .update({ question: editQuestion, options: cleanOptions, correct_index: editCorrect })
      .eq('id', id)

    if (error) return alert(error.message)
    setEditingId(null)
    loadQuestions()
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function deleteQuestion(id: string) {
    if (!confirm('ลบข้อสอบนี้?')) return
    await supabase.from('questions').delete().eq('id', id)
    loadQuestions()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold text-white">จัดการข้อสอบ</h1>

      {/* ✅ Form เพิ่มข้อสอบ */}
      <div className="bg-white p-5 rounded-lg shadow space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="คำถาม"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="border flex-1 px-3 py-1 rounded"
                placeholder={`ตัวเลือกที่ ${idx + 1}`}
                value={options[idx]}
                onChange={(e) => {
                  const copy = [...options]
                  copy[idx] = e.target.value
                  setOptions(copy)
                }}
              />

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={correct === idx}
                  onChange={() => setCorrect(idx)}
                />
                เฉลย
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          เพิ่มข้อสอบ
        </button>
      </div>

      {/* ✅ รายการข้อสอบ */}
      <div className="bg-white p-5 rounded-lg shadow">
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : rows.length === 0 ? (
          <p>ยังไม่มีข้อสอบ</p>
        ) : (
          <ul className="space-y-4">
            {rows.map((q) => (
              <li key={q.id} className="border p-4 rounded-lg">
                {editingId === q.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full border px-3 py-2 rounded"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                    />

                    <div className="space-y-2">
                      {editOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            className="border flex-1 px-3 py-1 rounded"
                            placeholder={`ตัวเลือกที่ ${idx + 1}`}
                            value={editOptions[idx]}
                            onChange={(e) => {
                              const copy = [...editOptions]
                              copy[idx] = e.target.value
                              setEditOptions(copy)
                            }}
                          />
                          <label className="flex items-center gap-1">
                            <input
                              type="radio"
                              checked={editCorrect === idx}
                              onChange={() => setEditCorrect(idx)}
                            />
                            เฉลย
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(q.id)} className="px-3 py-1 bg-green-600 text-white rounded">บันทึก</button>
                      <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 rounded">ยกเลิก</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">{q.question}</div>
                    <ul className="ml-4 mt-2 text-sm list-disc">
                      {q.options.map((o: string, i: number) => (
                        <li
                          key={i}
                          className={i === q.correct_index ? 'text-green-600 font-bold' : ''}
                        >
                          {o}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => beginEdit(q)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}
