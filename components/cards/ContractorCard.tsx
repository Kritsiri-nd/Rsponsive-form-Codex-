'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

type Props = {
  cardNo: string
  fullName: string
  companyName: string
  issuedDate: string | null
  expiredDate: string | null
  imageUrl?: string | null
  approverName?: string
  onPrint?: () => void
}

const instructionItems = [
  'บัตรนี้ใช้ได้เฉพาะผู้รับเหมาที่ผ่านการอบรมความปลอดภัยแล้วเท่านั้นและใช้ได้เฉพาะผู้ที่มีชื่อเป็นเจ้าของบัตรเท่านั้น',
  'ต้องติดบัตรนี้ตลอดเวลาที่ปฏิบัติงานอยู่ภายใต้บริษัทฯ สามารถตรวจสอบได้ตลอดเวลา',
  'ผู้รับเหมาจะต้องปฏิบัติตามกฎระเบียบด้านความปลอดภัยอย่างเคร่งครัด',
  'กรณีบัตรหมดอายุให้ผู้รับเหมาติดต่อแผนกความปลอดภัย เพื่อทำการทบทวนกฎความปลอดภัยและต่ออายุบัตร',
  'กรณีบัตรหายจะต้องแจ้งแผนกความปลอดภัยที่บริษัทฯ ให้ทราบทันที',
]

export default function ContractorCard({
  cardNo,
  fullName,
  companyName,
  issuedDate,
  expiredDate,
  approverName = 'Safety Officer',
  imageUrl,
  onPrint,
}: Props) {
  return (
    <div className="contractor-card overflow-hidden rounded-3xl border-4 border-blue-900 bg-white shadow-xl shadow-slate-900/10 print:shadow-none">
      <div className="card-sheet mx-auto grid w-full max-w-[800px] gap-6 bg-white p-6 md:grid-cols-1 print:flex print:w-auto print:max-w-none print:p-0 print:gap-0">
        <section className="card-face card-face--front relative flex aspect-[85.6/54] w-full max-w-[800px] flex-col overflow-hidden bg-white print:max-w-none print:rounded-none print:border print:border-blue-900">
          <header className="flex flex-wrap items-center justify-between gap-3 bg-[#0A2C84] px-6 py-3 text-white print:flex-nowrap print:px-4 print:py-2">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/30 bg-white print:h-8 print:w-8">
                <Image src="/Nittan-logo.png" alt="Nittan logo" fill sizes="48px" className="object-contain p-2" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold tracking-wide text-white print:text-[6px]">NITTAN (THAILAND) CO., LTD.</p>
                <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] print:text-[7px]">CONTRACTOR CARD</p>
                <p className="text-[11px] font-medium print:text-[6px]">บัตรอนุญาตทำงานผู้รับเหมา</p>
              </div>
            </div>
            <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/30 bg-white print:h-8 print:w-8">
              <Image src="/safety-logo.jpg" alt="Safety logo" fill sizes="48px" className="object-contain p-2" />
            </div>
          </header>

          <div className="flex flex-1 flex-col justify-between gap-6 px-8 py-6 text-[#0A2C84] print:flex-row print:gap-4 print:px-4 print:py-3 md:flex-row md:items-stretch">
            <div className="flex flex-1 items-center justify-center md:w-1/3">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#0A2C84] bg-white print:h-24 print:w-24">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Contractor photo" width={220} height={220} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-[#111] opacity-90" aria-hidden="true">
                    <div className="h-12 w-12 rounded-full bg-[#111]" />
                    <div className="mt-1.5 h-14 w-16 rounded-[45%] bg-[#111]" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1.5 md:w-1/3">
              <p className="text-sm font-semibold text-[#0A2C84] print:text-[7px]">เลขประจำตัวผู้รับเหมา :</p>
              <p className="text-3xl font-black text-[#0A2C84] print:text-[12px]">{cardNo}</p>
              <p className="text-sm font-semibold text-[#0A2C84] print:text-[7px]">
                ชื่อ - นามสกุล : <span className="font-bold text-[#0A2C84]">{fullName}</span>
              </p>
              <p className="text-sm font-semibold text-[#0A2C84] print:text-[7px]">
                ชื่อบริษัท : <span className="font-bold text-[#0A2C84] uppercase">{companyName}</span>
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-end gap-2 text-center text-[#0A2C84] md:w-1/3">
              <div className="flex w-full justify-between text-xs font-semibold print:text-[6px]">
                <div>
                  <p className="text-sm font-bold print:text-[7px]">{issuedDate ?? '-'}</p>
                  <p>วันที่ออกบัตร</p>
                </div>
                <div>
                  <p className="text-sm font-bold print:text-[7px]">{expiredDate ?? '-'}</p>
                  <p>วันหมดอายุบัตร</p>
                </div>
              </div>
              <div className="relative h-10 w-32 print:h-6 print:w-24">
                <Image src="/signature-mock.svg" alt="Signature placeholder" fill sizes="128px" className="object-contain" />
              </div>
              <p className="text-xs font-semibold print:text-[6px]">ออกบัตรโดย : {approverName}</p>
              <p className="text-[10px] uppercase tracking-wide print:text-[6px]">Safety Officer</p>
            </div>
          </div>
        </section>

        <section className="card-face card-face--back hidden aspect-[85.6/54] flex-col overflow-hidden bg-white print:flex print:max-w-none print:rounded-none print:border print:border-blue-900">
          <header className="flex items-center justify-between bg-[#0A2C84] px-6 py-3 text-white print:px-4 print:py-2">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/30 bg-white print:h-8 print:w-8">
                <Image src="/Nittan-logo.png" alt="Nittan logo" fill sizes="48px" className="object-contain p-2" />
              </div>
              <h2 className="text-[14px] font-semibold tracking-wide print:text-[8px]">เงื่อนไขและข้อปฏิบัติ</h2>
            </div>
            <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/30 bg-white print:h-8 print:w-8">
              <Image src="/safety-logo.jpg" alt="Safety logo" fill sizes="48px" className="object-contain p-2" />
            </div>
          </header>

          <article className="flex flex-1 flex-col justify-between px-6 py-5 text-[#0A2C84] print:px-4 print:py-3">
            <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed print:space-y-1.5 print:text-[7px] print:leading-snug">
              {instructionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <div className="rounded-2xl border border-[#0A2C84] bg-white px-4 py-3 text-center text-sm font-semibold text-[#0A2C84] shadow-sm print:px-3 print:py-2 print:text-[7px]">
              *** ติดต่อแผนกความปลอดภัย โทร. 038-743-486-9 ต่อ 223 ***
            </div>
          </article>
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
