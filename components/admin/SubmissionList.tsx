'use client'

import ContractorCard from '@/components/cards/ContractorCard'
import { cn } from '@/lib/utils'

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
    <ul className="space-y-5">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className={cn(printIds && !printIds.has(submission.id) && 'print:hidden')}
        >
          <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm shadow-slate-900/5 backdrop-blur print:hidden sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              ส่งเมื่อ {new Date(submission.created_at).toLocaleString('th-TH')}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(submission.id)}
                  onChange={(event) => onToggleSelect(submission.id, event.target.checked)}
                />
                เลือกพิมพ์
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={submission.viewed}
                  onChange={(event) => onToggleViewed(submission.id, event.target.checked)}
                />
                ดูแล้ว
              </label>
            </div>
          </div>

          <ContractorCard
            cardNo={submission.card_no || '-'}
            fullName={submission.full_name}
            companyName={submission.company || '-'}
            citizenId={submission.citizen_id || undefined}
            issuedDate={submission.issued_date}
            expiredDate={submission.expired_date}
            score={submission.score}
            onPrint={() => onPrintSingle(submission.id)}
          />
        </li>
      ))}
    </ul>
  )
}

