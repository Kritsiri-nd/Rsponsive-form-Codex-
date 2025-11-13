'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { SubmissionsToolbar } from '@/components/admin/SubmissionsToolbar'
import { SubmissionList } from '@/components/admin/SubmissionList'

type Submission = {
  id: string
  card_no: string | null
  full_name: string
  company: string | null
  created_at: string
  viewed: boolean
  issued_date: string | null
  expired_date: string | null
  citizen_id: string | null
  score: number | null
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [issuedDateFilter, setIssuedDateFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [printIds, setPrintIds] = useState<Set<string> | null>(null)

  const loadSubmissions = useCallback(async () => {
    startTransition(() => setLoading(true))
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    startTransition(() => {
      if (!error && data) {
        setSubmissions(data as Submission[])
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadSubmissions()

    const channel = supabase
      .channel('public:submissions-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, (payload) => {
        setSubmissions((prev) => {
          if (payload.eventType === 'INSERT') {
            return [payload.new as Submission, ...prev]
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map((record) => (record.id === payload.new.id ? (payload.new as Submission) : record))
          }
          if (payload.eventType === 'DELETE') {
            return prev.filter((record) => record.id !== payload.old.id)
          }
          return prev
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadSubmissions])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return submissions.filter((item) => {
      const matchKeyword = !keyword
        ? true
        : [item.card_no, item.full_name, item.company, item.citizen_id]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))

      const matchIssuedDate = !issuedDateFilter
        ? true
        : item.issued_date?.startsWith(issuedDateFilter) ?? false

      return matchKeyword && matchIssuedDate
    })
  }, [submissions, query, issuedDateFilter])

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function toggleViewed(id: string, viewed: boolean) {
    setSubmissions((prev) => prev.map((record) => (record.id === id ? { ...record, viewed } : record)))
    await supabase.from('submissions').update({ viewed }).eq('id', id)
  }

  function selectAllVisible() {
    setSelectedIds(new Set(filtered.map((item) => item.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function triggerPrint(ids: Set<string>) {
    if (ids.size === 0) return
    const targets = new Set(ids)
    setPrintIds(targets)

    const handleAfterPrint = () => {
      setPrintIds(null)
      window.removeEventListener('afterprint', handleAfterPrint)
    }

    window.addEventListener('afterprint', handleAfterPrint)
    setTimeout(() => window.print(), 0)
  }

  function printSelected() {
    triggerPrint(selectedIds)
  }

  function printAll() {
    triggerPrint(new Set(filtered.map((item) => item.id)))
  }

  function printSingle(id: string) {
    triggerPrint(new Set([id]))
  }

  const exportVisibleToExcel = useCallback(() => {
    if (filtered.length === 0) return

    const escapeCell = (value: string | number | null) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    const headers = [
      'Card No.',
      'Full Name',
      'Company',
      'Issued Date',
      'Expired Date',
      'Citizen ID',
      'Score',
    ]

    const headerRow = `<tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>`
    const bodyRows = filtered
      .map((item) => {
        const cells = [
          escapeCell(item.card_no),
          escapeCell(item.full_name),
          escapeCell(item.company),
          escapeCell(item.issued_date),
          escapeCell(item.expired_date),
          escapeCell(item.citizen_id),
          escapeCell(item.score ?? ''),
        ]
        return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`
      })
      .join('')

    const htmlTable = `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`
    const blob = new Blob(['\ufeff' + htmlTable], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const timestamp = new Date().toISOString().split('T')[0]
    link.download = `contractor-cards-${timestamp}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filtered])

  return (
    <div className="space-y-6">
      <header className="space-y-2 print:hidden">
        <h1 className="text-3xl font-semibold text-slate-900">แดชบอร์ดบัตรผู้รับเหมา</h1>
        <p className="text-sm text-slate-500">
          ตรวจสอบสถานะ ส่งพิมพ์ และติดตามบัตรผู้รับเหมาได้จากหน้าเดียว
        </p>
      </header>

      <SubmissionsToolbar
        query={query}
        onQueryChange={setQuery}
        issuedDate={issuedDateFilter}
        onIssuedDateChange={setIssuedDateFilter}
        onSelectAll={selectAllVisible}
        onClearSelection={clearSelection}
        onPrintSelected={printSelected}
        onPrintAll={printAll}
        onExportExcel={exportVisibleToExcel}
        selectedCount={selectedIds.size}
        totalVisible={filtered.length}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-10 text-center text-sm text-slate-500 shadow-sm">
          กำลังโหลดข้อมูล...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 p-10 text-center text-sm text-slate-500 shadow-sm">
          ยังไม่มีข้อมูลบัตรที่ตรงกับการค้นหา
        </div>
      ) : (
        <SubmissionList
          submissions={filtered}
          selected={selectedIds}
          printIds={printIds}
          onToggleSelect={toggleSelected}
          onToggleViewed={toggleViewed}
          onPrintSingle={printSingle}
        />
      )}
    </div>
  )
}


