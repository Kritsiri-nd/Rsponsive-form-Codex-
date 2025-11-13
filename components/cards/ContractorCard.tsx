'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  cardNo: string
  fullName: string
  companyName: string
  issuedDate: string | null
  expiredDate: string | null
  approverName?: string
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
  issuedDate,
  expiredDate,
  approverName = 'Authorized Signature',
  onPrint,
}: Props) {
  const faceStyle: CSSProperties = { aspectRatio: '85.6 / 54' }

  return (
    <div className="contractor-card overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl shadow-amber-300/20">
      <div className="card-sheet mx-auto grid w-full max-w-[720px] gap-6 bg-gradient-to-r from-white via-white to-amber-50 p-6 md:grid-cols-2 print:block print:w-auto print:max-w-none print:bg-white print:p-0 print:gap-0">
        <section
          style={faceStyle}
          className="card-face card-face--front relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-amber-200 bg-white/90 p-6 shadow-sm print:shadow-none"
        >
          <header className="flex items-center justify-between print:gap-2">
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-sky-500 bg-sky-50 text-[10px] font-semibold uppercase text-sky-600 print:h-9 print:w-9 print:text-[7px]">
              Nittan
            </div>
            <div className="flex flex-1 flex-col items-center gap-1 px-4 text-center print:px-2">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-600 print:text-[9px]">
                NITTAN (THAILAND) CO., LTD.
              </p>
              <p className="text-lg font-black uppercase tracking-wide text-amber-600 print:text-[15px]">Contractor Card</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 print:text-[8px]">บัตรอนุญาตทำงานผู้รับเหมา</p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-[10px] font-semibold uppercase text-emerald-600 print:h-9 print:w-9 print:text-[7px]">
              Safety
            </div>
          </header>

          <div className="mt-4 flex flex-col gap-4 print:mt-3 print:gap-3">
            <div className="flex flex-col gap-2">
              <Field label="ID No." value={cardNo} highlight />
              <Field label="Company" value={companyName} />
              <Field label="Name – Surname" value={fullName} />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:flex-row print:items-start print:gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <Field label="Issued Date" value={issuedDate ?? '-'} />
                <Field label="Expired Date" value={expiredDate ?? '-'} />
              </div>

              <div className="flex w-full max-w-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3 text-center print:max-w-[140px] print:gap-1.5 print:px-3 print:py-2">
                <p className="text-xs font-semibold text-slate-500 print:text-[8px]">ลายเซ็นต์</p>
                <div className="relative h-12 w-full max-w-[160px] print:h-9">
                  <Image src="/signature-mock.svg" alt="Signature placeholder" fill sizes="160px" className="object-contain" />
                </div>
                <p className="text-sm font-medium text-slate-600 print:text-[8px]">{approverName}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 print:text-[7px]">Approver</p>
              </div>
            </div>
          </div>
        </section>

        <section
          style={faceStyle}
          className="card-face card-face--back flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-emerald-200 bg-white/90 p-6 text-slate-700 shadow-sm print:shadow-none"
        >
          <div>
            <div className="flex items-center gap-3 print:gap-2">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-emerald-400 bg-emerald-50 print:h-9 print:w-9">
                <Image src="/globe.svg" alt="Safety" fill sizes="48px" className="object-contain p-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700 print:text-[9px]">เงื่อนไขความปลอดภัย</p>
                <p className="text-xs text-emerald-500 print:text-[8px]">Safety First</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-600 print:mt-2 print:space-y-1.5 print:text-[8px]">
              {instructionItems.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400 print:mt-1" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs text-emerald-600 print:mt-4 print:p-2 print:text-[8px]">
            โทรฉุกเฉิน: 038-743-486-9 ต่อ 223
          </div>
        </section>
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
    <div
      className={cn(
        'flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-transparent bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 print:flex-nowrap print:gap-x-3 print:px-2 print:py-1.5 print:text-[10px]',
        highlight && 'border-amber-200 bg-amber-50 text-amber-700'
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 print:text-[8px]">{label}</span>
      <span className="flex-1 break-words text-left text-sm font-semibold text-slate-800 print:min-w-0 print:text-[10px]">{value}</span>
    </div>
  )
}
