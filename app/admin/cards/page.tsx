'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type CardRecord = {
  id: string
  card_no: string | null
  full_name: string
  citizen_id: string | null
  company: string | null
  issued_date: string | null
  expired_date: string | null
  trainer: string | null
}

export default function ContractorCardAdminPage() {
  const [records, setRecords] = useState<CardRecord[]>([])
  const [query, setQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('ทั้งหมด')
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
        ? [record.card_no, record.full_name, record.company, record.citizen_id, record.trainer]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))
        : true

      const matchesCompany =
        companyFilter === 'ทั้งหมด' ? true : record.company?.toLowerCase() === companyFilter.toLowerCase()

      return matchesKeyword && matchesCompany
    })
  }, [records, query, companyFilter])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">รายการบัตรผู้รับเหมา</h1>
        <p className="text-sm text-slate-500">
          ตรวจสอบสถานะบัตรและวันหมดอายุ พร้อมค้นหาตามชื่อ บริษัท หรือหมายเลขบัตร
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
          <CardDescription>เริ่มพิมพ์เพื่อค้นหาทันที หรือกรองตามบริษัทที่ต้องการ</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ผลการค้นหา ({filtered.length})</CardTitle>
          <CardDescription>ข้อมูลล่าสุดเรียงตามเวลาที่สร้างบัตร</CardDescription>
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
                  <th className="px-4 py-3 font-semibold">ผู้ฝึกอบรม</th>
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
                        <td className="px-4 py-3 text-slate-700">{record.trainer || '-'}</td>
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

  const parsedYear = Number(year) + 2500 - 543
  const date = new Date(parsedYear, Number(month) - 1, Number(day))
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return 'หมดอายุแล้ว'
  if (diff === 0) return 'หมดอายุวันนี้'
  return `เหลือ ${diff} วัน`
}

