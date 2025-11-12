'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type CardRecord = {
  card_no: string | null
  id: string
  full_name: string
  citizen_id: string | null
  company: string | null
  issued_date: string | null
  expired_date: string | null
  trainer: string | null
}

export default function ContractorCardAdminPage() {
  const [rows, setRows] = useState<CardRecord[]>([])
  const [query, setQuery] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRows(data as CardRecord[])
      }
      setLoading(false)
    }
    load()
  }, [])

  function daysLeft(expired: string | null) {
    if (!expired) return '-'
    const [d, m, y] = expired.split('/')
    const exp = new Date(Number(y) + 2500 - 543, Number(m) - 1, Number(d)) // แปลงปีไทยกลับสากล
    const diff = Math.ceil((exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff < 0 ? 'หมดอายุแล้ว' : diff + ' วัน'
  }

  const filtered = useMemo(() => {
    let data = rows

    if (query.trim()) {
      const q = query.toLowerCase()
      data = data.filter((r) =>
        [
          r.card_no,
          r.full_name,
          r.company,
          r.citizen_id,
          r.issued_date,
          r.expired_date,
          r.trainer,
        ]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }

    if (filterCompany) data = data.filter((r) => r.company === filterCompany)

    return data
  }, [rows, query, filterCompany])

  const uniqueCompany = Array.from(new Set(rows.map((r) => r.company).filter(Boolean)))
  // department filter removed per request

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold text-white mb-3">Contractor Card – Admin</h1>

      {/* ✅ Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="ค้นหา..."
          className="border rounded-lg px-3 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
        >
          <option value="">บริษัททั้งหมด</option>
          {uniqueCompany.map((c) => (
            <option key={c} value={c || ''}>{c}</option>
          ))}
        </select>
        <div />
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">Card No</th>
              <th className="border px-3 py-2">Name Surname</th>
              <th className="border px-3 py-2">Citizen ID</th>
              <th className="border px-3 py-2">Company</th>
              <th className="border px-3 py-2">Issued Date</th>
              <th className="border px-3 py-2">Expired Date</th>
              <th className="border px-3 py-2">วันที่เหลือ</th>
              <th className="border px-3 py-2">Trainer</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-4">กำลังโหลด...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-4">ไม่พบข้อมูล</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.card_no}</td>
                  <td className="border px-3 py-2">{r.full_name}</td>
                  <td className="border px-3 py-2">{r.citizen_id}</td>
                  <td className="border px-3 py-2">{r.company}</td>
                  <td className="border px-3 py-2">{r.issued_date}</td>
                  <td className="border px-3 py-2">{r.expired_date}</td>
                  <td className="border px-3 py-2">
                    {daysLeft(r.expired_date)}
                  </td>
                  <td className="border px-3 py-2">{r.trainer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
