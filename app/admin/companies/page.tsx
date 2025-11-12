'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Company = {
  id: string
  full_name: string
  short_name: string
  created_at: string
}

const emptyCompany = { full_name: '', short_name: '' }

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formValues, setFormValues] = useState(emptyCompany)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadCompanies = useCallback(async () => {
    startTransition(() => setLoading(true))
    const { data, error } = await supabase
      .from('company_master')
      .select('*')
      .order('created_at', { ascending: false })

    startTransition(() => {
      if (!error && data) {
        setCompanies(data as Company[])
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return companies
    return companies.filter((company) =>
      [company.full_name, company.short_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    )
  }, [companies, search])

  function beginCreate() {
    setEditingId(null)
    setFormValues(emptyCompany)
  }

  function beginEdit(company: Company) {
    setEditingId(company.id)
    setFormValues({ full_name: company.full_name, short_name: company.short_name })
  }

  function handleChange(key: 'full_name' | 'short_name', value: string) {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const full_name = formValues.full_name.trim()
    const short_name = formValues.short_name.trim().toUpperCase()

    if (!full_name) return alert('กรุณากรอกชื่อบริษัท')
    if (!short_name) return alert('กรุณากรอกชื่อย่อบริษัท')

    setSaving(true)

    const { error } = editingId
      ? await supabase.from('company_master').update({ full_name, short_name }).eq('id', editingId)
      : await supabase.from('company_master').insert({ full_name, short_name })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    setFormValues(emptyCompany)
    setEditingId(null)
    await loadCompanies()
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">จัดการบริษัทคู่สัญญา</h1>
        <p className="text-sm text-slate-500">
          เพิ่ม แก้ไข หรือค้นหาบริษัท เพื่อใช้งานในแบบฟอร์มลงทะเบียนและหมายเลขบัตรอัตโนมัติ
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="h-full">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>รายชื่อบริษัท ({companies.length})</CardTitle>
              <CardDescription>กำหนดชื่อเต็มและชื่อย่อเพื่อให้ผู้สมัครเลือกได้สะดวก</CardDescription>
            </div>
            <Button variant="outline" onClick={beginCreate}>
              เพิ่มบริษัทใหม่
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="ค้นหาชื่อบริษัทหรือชื่อย่อ"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full table-auto text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ชื่อบริษัท</th>
                    <th className="px-4 py-3 font-semibold">ชื่อย่อ</th>
                    <th className="px-4 py-3 font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                        ไม่พบข้อมูลบริษัท
                      </td>
                    </tr>
                  ) : (
                    filtered.map((company) => (
                      <tr key={company.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{company.full_name}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{company.short_name}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" onClick={() => beginEdit(company)}>
                            แก้ไข
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'แก้ไขข้อมูลบริษัท' : 'เพิ่มบริษัทใหม่'}</CardTitle>
            <CardDescription>
              กำหนดชื่อเต็มสำหรับหน้าฟอร์ม และชื่อย่อสำหรับสร้างหมายเลขบัตร (เช่น KP → KP001)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">ชื่อบริษัท</label>
                <Input
                  value={formValues.full_name}
                  onChange={(event) => handleChange('full_name', event.target.value)}
                  placeholder="เช่น KP Engineering Co., Ltd."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">ชื่อย่อ</label>
                <Input
                  value={formValues.short_name}
                  onChange={(event) => handleChange('short_name', event.target.value)}
                  placeholder="เช่น KPE"
                  maxLength={6}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                {editingId ? (
                  <Button type="button" variant="ghost" onClick={beginCreate}>
                    ยกเลิกการแก้ไข
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400">ชื่อย่อจะถูกแปลงเป็นตัวพิมพ์ใหญ่โดยอัตโนมัติ</span>
                )}

                <Button type="submit" disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มบริษัท'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

