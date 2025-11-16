'use client'

import ContractorCard from '@/components/cards/ContractorCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Submission = {
  id: string
  card_no: string | null
  full_name: string
  company: string | null
  created_at: string
  issued_date: string | null
  expired_date: string | null
  citizen_id: string | null
  score: number | null
  image_url: string | null
  viewed: boolean
}

type Props = {
  submissions: Submission[]
  selected: Set<string>
  printIds: Set<string> | null
  onToggleSelect: (id: string, checked: boolean) => void
  onToggleViewed: (id: string, checked: boolean) => void
  onPrintSingle: (id: string) => void
}

export function SubmissionList({
  submissions,
  selected,
  printIds,
  onToggleSelect,
  onToggleViewed,
  onPrintSingle,
}: Props) {
  return (
    <>
      {/* รายการสำหรับแสดงในหน้า admin - ซ่อนเมื่อพิมพ์ */}
      <div className="print:hidden">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  เลขประจำตัวผู้รับเหมา
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  ชื่อ - นามสกุล
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  ชื่อบริษัท
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  วันที่ออกบัตร
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">
                    {submission.card_no || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {submission.full_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {submission.company || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {submission.issued_date || '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={selected.has(submission.id)}
                          onChange={(event) => onToggleSelect(submission.id, event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        เลือกพิมพ์
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={submission.viewed}
                          onChange={(event) => onToggleViewed(submission.id, event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        ดูแล้ว
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPrintSingle(submission.id)}
                      >
                        พิมพ์
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* การ์ดสำหรับพิมพ์ - แสดงเฉพาะเมื่อพิมพ์ */}
      <ul className="hidden space-y-5 print:block print:space-y-0">
        {submissions.map((submission) => (
          <li
            key={submission.id}
            className={cn(printIds && !printIds.has(submission.id) && 'print:hidden')}
          >
            <ContractorCard
              cardNo={submission.card_no || '-'}
              fullName={submission.full_name}
              companyName={submission.company || '-'}
              issuedDate={submission.issued_date}
              expiredDate={submission.expired_date}
              imageUrl={submission.image_url}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
