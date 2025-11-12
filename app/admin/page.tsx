'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import PrintCard from '@/components/PrintCard'

type Submission = {
  id: string
  card_no: string | null
  full_name: string
  age: number | null
  company: string | null
  position: string | null
  image_url: string | null
  created_at: string
  viewed: boolean
  issued_date: string | null
  expired_date: string | null
}

export default function AdminPage() {
  const [rows, setRows] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [printIds, setPrintIds] = useState<Set<string> | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.full_name, r.company, r.position].some((v) => (v || '').toLowerCase().includes(q))
    )
  }, [rows, query])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setRows(data as any)
      setLoading(false)
    }
    load()

    // Realtime: listen INSERT/UPDATE
    const channel = supabase
      .channel('public:submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload: any) => {
          setRows((prev) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new as Submission, ...prev]
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((r) => (r.id === payload.new.id ? (payload.new as Submission) : r))
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function toggleViewed(id: string, viewed: boolean) {
    await supabase.from('submissions').update({ viewed }).eq('id', id)
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function selectAllVisible() {
    setSelectedIds(new Set(filtered.map((r) => r.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function triggerPrint(ids: Set<string>) {
    if (ids.size === 0) return
    const targets = new Set(ids)
    setPrintIds(targets)

    const after = () => {
      setPrintIds(null)
      window.removeEventListener('afterprint', after)
    }

    window.addEventListener('afterprint', after)
    setTimeout(() => window.print(), 0)
  }

  function printSelected() {
    triggerPrint(selectedIds)
  }

  function printAll() {
    const allVisible = new Set(filtered.map((r) => r.id))
    triggerPrint(allVisible)
  }

  function printSingle(id: string) {
    triggerPrint(new Set([id]))
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
        <h1 className="text-2xl font-bold heading">Admin Dashboard</h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full">
          <input
            placeholder="ค้นหา: ชื่อ / บริษัท / ตำแหน่ง"
            className="w-full md:w-80 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllVisible}
              className="px-3 py-2 rounded-lg text-sm btn-outline"
            >
              เลือกทั้งหมด
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-2 rounded-lg text-sm btn-outline"
            >
              ล้างการเลือก
            </button>
            <button
              onClick={printSelected}
              disabled={selectedIds.size === 0}
              className="px-3 py-2 rounded-lg text-sm btn-primary disabled:opacity-50"
            >
              พิมพ์ที่เลือก ({selectedIds.size})
            </button>
            <button
              onClick={printAll}
              className="px-3 py-2 rounded-lg text-sm btn-primary"
            >
              พิมพ์ทั้งหมด
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : filtered.length === 0 ? (
        <p>ยังไม่มีข้อมูล</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((r) => (
            <li
              key={r.id}
              className={`${printIds && !printIds.has(r.id) ? 'print:hidden' : ''} card rounded-xl shadow-sm p-4 print:p-0 print:shadow-none`}
            >
              <div className="flex items-center justify-between mb-3 print:hidden">
                <div className="text-sm text-gray-500">
                  ส่งเมื่อ {new Date(r.created_at).toLocaleString('th-TH')}
                </div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={(e) => toggleSelected(r.id, e.target.checked)}
                    />
                    เลือกพิมพ์
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={r.viewed}
                      onChange={(e) => toggleViewed(r.id, e.target.checked)}
                    />
                    ดูแล้ว
                  </label>
                </div>
              </div>

              <PrintCard
                id={r.card_no || ''}
                full_name={r.full_name}
                company={r.company}
                issued_date={r.issued_date}
                expired_date={r.expired_date}
                onPrint={() => printSingle(r.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


