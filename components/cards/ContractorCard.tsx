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
  'บัตรนี้ใช้ได้เฉพาะผู้รับเหมาที่ผ่านการอบรมความปลอดภัยแล้วเท่านั้นและใช้ได้เฉพาะผู้ที่มีชื่อเป็นเจ้าของบัตรเท่านั้น',
  'ต้องติดบัตรนี้ตลอดเวลาที่ปฎิบัติงานอยู่ภายใต้บริษัทฯ สามารถตรวจสอบได้ตลอดเวลา',
  'ผู้รับเหมาจะต้องปฎิบัติตามกฎระเบียบด้านความปลอดภัยอย่างเคร่งครัด',
  'กรณีบัตรหมดอายุให้ผู้รับเหมาติดต่อแผนกความปลอดภัย เพื่อทำการทบทวนกฎความปลอดภัยและต่ออายุบัตร',
  'กรณีบัตรหายจะต้องแจ้งแผนกความปลอดภัยที่บริษัทฯให้ทราบทันที'
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
      <div className="card-sheet mx-auto grid w-full max-w-[720px] gap-6 bg-gradient-to-r from-white via-white to-amber-50 p-6 md:grid-cols-2 print:flex print:w-auto print:max-w-none print:bg-white print:p-0 print:gap-0">
        <section
          style={faceStyle}
          className="card-face card-face--front relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-7 shadow-sm print:p-3 print:shadow-none"
        >
          <header className="flex items-center justify-between print:gap-2">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-sky-500 bg-sky-50 text-xs font-semibold uppercase text-sky-600 print:h-7 print:w-7 print:text-[6px]">
              Nittan
            </div>
            <div className="flex flex-1 flex-col items-center gap-1.5 px-4 text-center print:gap-1 print:px-2">
              <p className="text-sm font-semibold tracking-[0.25em] text-slate-600 print:text-[7px]">
                NITTAN (THAILAND) CO., LTD.
              </p>
              <p className="text-xl font-black uppercase tracking-wide text-amber-600 print:text-[11px]">Contractor Card</p>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 print:text-[7px]">บัตรอนุญาตทำงานผู้รับเหมา</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-xs font-semibold uppercase text-emerald-600 print:h-7 print:w-7 print:text-[6px]">
              Safety
            </div>
          </header>

          <div className="mt-6 flex flex-col gap-5 print:mt-2 print:gap-1">
            <div className="flex flex-col gap-2.5 print:gap-1.5">
              <Field label="ID No." value={cardNo} highlight />
              <Field label="Company" value={companyName} />
              <Field label="Name – Surname" value={fullName} />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:flex-row print:items-start print:gap-2 print:-mt-1">
              <div className="flex flex-1 flex-col gap-2 print:gap-1.5">
                <Field label="Issued Date" value={issuedDate ?? '-'} />
                <Field label="Expired Date" value={expiredDate ?? '-'} />
              </div>

              <div className="flex w-full max-w-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-50/80 px-4 py-3 text-center print:max-w-[32mm] print:gap-1 print:px-2 print:py-1.5">
                <div className="relative h-12 w-full max-w-[160px] print:h-6 print:max-w-[28mm]">
                  <Image src="/signature-mock.svg" alt="Signature placeholder" fill sizes="160px" className="object-contain" />
                </div>
                <p className="text-base font-medium text-slate-600 print:text-[6px]">{approverName}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 print:text-[6px]">Approver</p>
              </div>
            </div>
          </div>
        </section>

        <section
          style={faceStyle}
          className="card-face card-face--back flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-7 text-slate-700 shadow-sm print:p-3 print:shadow-none"
        >
          <div>
            <div className="flex items-center gap-3 print:gap-1.5">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-emerald-400 bg-emerald-50 print:h-6 print:w-6">
                <Image src="/globe.svg" alt="Safety" fill sizes="56px" className="object-contain p-2 print:p-1" />
              </div>
              <div>
                <p className="text-base font-semibold text-emerald-700 print:text-[7px]">เงื่อนไขความปลอดภัย</p>
                <p className="text-sm text-emerald-500 print:text-[6px]">Safety First</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-slate-600 print:mt-2 print:space-y-1 print:text-[6px] print:leading-tight">
              {instructionItems.map((item, index) => (
                <li key={index} className="flex gap-2 print:gap-1">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-emerald-400 print:mt-0.5 print:h-1 print:w-1" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-600 print:mt-2 print:p-1.5 print:text-[6px]">
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
        'flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-transparent bg-slate-50 px-4 py-2.5 text-base font-semibold text-slate-800 print:flex-nowrap print:gap-x-1.5 print:px-1.5 print:py-1 print:text-[7px]',
        highlight && 'border-amber-200 bg-amber-50 text-amber-700'
      )}
    >
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500 print:text-[6px]">{label}</span>
      <span className="flex-1 break-words text-left text-base font-medium text-slate-800 print:min-w-0 print:text-[7px]">{value}</span>
    </div>
  )
}
