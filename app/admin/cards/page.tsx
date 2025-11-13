'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type CardRecord = {
  id: string
  card_no: string | null
  full_name: string
  citizen_id: string | null
  company: string | null
  issued_date: string | null
  expired_date: string | null
  score: number | null
}

export default function ContractorCardAdminPage() {
  const [records, setRecords] = useState<CardRecord[]>([])
  const [query, setQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('ทั้งหมด')
  const [issuedDateFilter, setIssuedDateFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCards = useCallback(async () => {
    startTransition(() => setLoading(true))
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    startTransition(() => {
      if (!error && data) {
        setRecords(data as CardRecord[])
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const companies = useMemo(() => {
    const set = new Set<string>()
    records.forEach((item) => {
      if (item.company) set.add(item.company)
    })
    return ['ทั้งหมด', ...Array.from(set)]
  }, [records])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return records.filter((record) => {
      const matchesKeyword = keyword
        ? [record.card_no, record.full_name, record.company, record.citizen_id]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))
        : true

      const matchesCompany =
        companyFilter === 'ทั้งหมด' ? true : record.company?.toLowerCase() === companyFilter.toLowerCase()

      const matchesIssuedDate = issuedDateFilter
        ? toIsoDate(record.issued_date) === issuedDateFilter
        : true

      return matchesKeyword && matchesCompany && matchesIssuedDate
    })
  }, [records, query, companyFilter, issuedDateFilter])

  const exportFilteredToExcel = useCallback(() => {
    if (filtered.length === 0) return

    const escapeCell = (value: string | number | null) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    const headers = [
      'Card No.',
      'Full Name',
      'Citizen ID',
      'Company',
      'Issued Date',
      'Expired Date',
      'Status',
      'Score',
    ]

    const headerRow = `<tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>`
    const bodyRows = filtered
      .map((item) => {
        const cells = [
          escapeCell(item.card_no),
          escapeCell(item.full_name),
          escapeCell(item.citizen_id),
          escapeCell(item.company),
          escapeCell(item.issued_date),
          escapeCell(item.expired_date),
          escapeCell(getExpiryStatus(item.expired_date)),
          escapeCell(typeof item.score === 'number' ? `${item.score}` : ''),
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
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">รายการบัตรผู้รับเหมา</h1>
        <p className="text-sm text-slate-500">
          ตรวจสอบสถานะบัตรและวันหมดอายุ พร้อมค้นหาตามชื่อ บริษัท หมายเลขบัตร หรือวันที่ออกบัตร
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
          <CardDescription>กรองตามชื่อ บริษัท หรือวันที่ออกบัตรเพื่อค้นหาบัตรที่ต้องการอย่างรวดเร็ว</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">ค้นหา</label>
            <Input
              placeholder="ค้นหาบัตรจากชื่อ, บริษัท หรือเลขบัตร"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">บริษัท</label>
            <Select value={companyFilter} onChange={(event) => setCompanyFilter(event.target.value)}>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">วันที่ออกบัตร</label>
            <Input
              type="date"
              value={issuedDateFilter}
              onChange={(event) => setIssuedDateFilter(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>ผลการค้นหา ({filtered.length})</CardTitle>
            <CardDescription>ข้อมูลล่าสุดเรียงตามเวลาที่สร้างบัตร</CardDescription>
          </div>
          <Button variant="outline" onClick={exportFilteredToExcel} disabled={filtered.length === 0}>
            ส่งออก Excel
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">เลขบัตร</th>
                  <th className="px-4 py-3 font-semibold">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 font-semibold">บัตรประชาชน</th>
                  <th className="px-4 py-3 font-semibold">บริษัท</th>
                  <th className="px-4 py-3 font-semibold">ออกบัตร</th>
                  <th className="px-4 py-3 font-semibold">หมดอายุ</th>
                  <th className="px-4 py-3 font-semibold">สถานะ</th>
                  <th className="px-4 py-3 font-semibold">ข้อที่ตอบถูก</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      ไม่พบบัตรที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filtered.map((record) => {
                    const status = getExpiryStatus(record.expired_date)
                    return (
                      <tr key={record.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-slate-900">{record.card_no}</td>
                        <td className="px-4 py-3 text-slate-700">{record.full_name}</td>
                        <td className="px-4 py-3 text-slate-700">{record.citizen_id || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{record.company || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{record.issued_date || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{record.expired_date || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{status}</td>
                        <td className="px-4 py-3 text-slate-700">{typeof record.score === 'number' ? `${record.score} ข้อ` : '-'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getExpiryStatus(expired: string | null) {
  if (!expired) return '-'
  const [day, month, year] = expired.split('/')
  if (!day || !month || !year) return '-'

  const parsedYear = convertYear(year)
  const date = new Date(parsedYear, Number(month) - 1, Number(day))
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return 'หมดอายุแล้ว'
  if (diff === 0) return 'หมดอายุวันนี้'
  return `เหลือ ${diff} วัน`
}

function toIsoDate(source: string | null) {
  if (!source) return null
  const [day, month, year] = source.split('/')
  if (!day || !month || !year) return null

  const parsedYear = convertYear(year)
  if (Number.isNaN(parsedYear)) return null

  const isoYear = String(parsedYear).padStart(4, '0')
  const isoMonth = month.padStart(2, '0')
  const isoDay = day.padStart(2, '0')

  return `${isoYear}-${isoMonth}-${isoDay}`
}

function convertYear(year: string) {
  const numeric = Number(year)
  if (Number.isNaN(numeric)) return Number.NaN

  if (year.length === 4) {
    return numeric > 2400 ? numeric - 543 : numeric
  }

  const beYear = numeric + 2500
  return beYear - 543
}

