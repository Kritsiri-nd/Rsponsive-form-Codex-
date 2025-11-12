'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  cardNo: string
  fullName: string
  companyName: string
  citizenId?: string
  department?: string
  trainer?: string
  issuedDate: string | null
  expiredDate: string | null
  onPrint?: () => void
}

const instructionItems = [
  'บัตรนี้ใช้ได้เฉพาะพื้นที่ที่กำหนดภายในโรงงานและต้องแสดงต่อเจ้าหน้าที่เมื่อร้องขอ',
  'ผู้ถือบัตรต้องปฏิบัติตามข้อกำหนดความปลอดภัยและสวมอุปกรณ์ป้องกันอันตรายครบถ้วน',
  'หากพบเหตุการณ์ไม่ปลอดภัย ให้รายงานผู้ควบคุมงานหรือเจ้าหน้าที่ความปลอดภัยทันที',
  'ห้ามส่งต่อหรือยืมบัตรแก่ผู้อื่น หากบัตรสูญหายให้แจ้งเพื่อระงับการใช้งานทันที',
]

export default function ContractorCard({
  cardNo,
  fullName,
  companyName,
  citizenId,
  department,
  trainer,
  issuedDate,
  expiredDate,
  onPrint,
}: Props) {
  return (
    <div className="contractor-card overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl shadow-amber-300/20">
      <div className="grid gap-4 bg-gradient-to-r from-white via-white to-amber-50 p-6 print:p-5 md:grid-cols-[3fr_2fr] md:gap-6">
        <div className="flex flex-col gap-4">
          <header className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-sky-50 to-amber-50 px-4 py-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-sky-500 text-[10px] font-semibold uppercase text-sky-600">
              Nittan
            </div>
            <div className="flex-1 text-center">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-600">
                NITTAN (THAILAND) CO., LTD.
              </p>
              <p className="text-lg font-black uppercase tracking-wide text-amber-600">Contractor Card</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">บัตรอนุญาตทำงานผู้รับเหมา</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-emerald-500 text-[10px] font-semibold uppercase text-emerald-600">
              Safety
            </div>
          </header>

          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm text-slate-700">
              <Field label="ID No." value={cardNo} highlight />
              <Field label="Company Name" value={companyName} />
              <Field label="Name – Surname" value={fullName} />
              {department && <Field label="Department" value={department} />}
              {citizenId && <Field label="Citizen ID" value={citizenId} />}
              <Field label="Issued Date" value={issuedDate ?? '-'} />
              <Field label="Expired Date" value={expiredDate ?? '-'} />
              {trainer && <Field label="Trainer" value={trainer} />}
            </div>
          </div>
        </div>

        <aside className="flex h-full flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-4 shadow-inner shadow-emerald-200/40">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-emerald-400 bg-emerald-50">
                <Image src="/globe.svg" alt="Safety" fill sizes="48px" className="object-contain p-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700">เงื่อนไขความปลอดภัย</p>
                <p className="text-xs text-emerald-500">Safety First</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-600">
              {instructionItems.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs text-emerald-600">
            โทรฉุกเฉิน: 038-743-486-9 ต่อ 223
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-6 py-4 print:hidden">
        <Button variant="outline" onClick={onPrint}>
          พิมพ์บัตรนี้
        </Button>
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  highlight?: boolean
}

function Field({ label, value, highlight }: FieldProps) {
  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span
        className={cn(
          'rounded-xl border border-transparent px-3 py-2 font-semibold text-slate-800',
          highlight ? 'border-amber-200 bg-amber-50 text-amber-700' : 'bg-slate-50'
        )}
      >
        {value}
      </span>
    </>
  )
}

