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
  imageUrl,
  onPrint,
}: Props) {
  return (
    <div className="contractor-card overflow-hidden rounded-3xl border-4 border-blue-900 bg-white shadow-xl shadow-slate-900/10 print:shadow-none">
      <div className="card-sheet mx-auto grid w-full max-w-[800px] gap-6 bg-white p-6 md:grid-cols-1 print:flex print:w-auto print:max-w-none print:p-0 print:gap-0">
        <section className="ccard-face--front relative flex aspect-[85.6/54] w-full max-w-[800px] flex-col justify-between overflow-hidden bg-white print:max-w-none print:rounded-none print:border print:border-blue-900">
          <header className="flex items-center gap-4 bg-[#0A2C84] px-4 py-2 text-white">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-md border border-white/30 bg-white">
                <Image src="/Nittan-logo.png" alt="Nittan logo" fill sizes="32px" className="object-contain p-2" />
              </div>
              <div className="leading-tight text-white">
                <p className="text-[6px] font-semibold tracking-wide">NITTAN (THAILAND) CO., LTD.</p>
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-wide">CONTRACTOR CARD</p>
              <p className="text-[6px] font-medium">บัตรอนุญาตทำงานผู้รับเหมา</p>
            </div>
          </header>

          <div className="flex flex-1 items-stretch gap-4 px-4 py-3">
            <div className="flex w-2/5 items-center justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#0A2C84] bg-white">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Contractor photo"
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-black opacity-90">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex w-3/5 flex-col justify-center gap-1 text-[7px] font-semibold text-black">
              <p>เลขประจำตัวผู้รับเหมาฯ :</p>
              <p className="text-[12px] font-black">{cardNo}</p>
              <p>
                ชื่อ - นามสกุล : <span className="font-bold">{fullName}</span>
              </p>
              <p>
                ชื่อบริษัท : <span className="font-bold uppercase">{companyName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-end gap-2 px-4 text-black">
            <div className="flex-1 text-left text-[6px]">
              <p className="text-[8px] font-bold">{issuedDate ?? '-'}</p>
              <p>วันที่ออกบัตร</p>
            </div>
            <div className="flex-1 text-left text-[6px]">
              <p className="text-[8px] font-bold">{expiredDate ?? '-'}</p>
              <p>วันหมดอายุ</p>
            </div>
            <div className="flex flex-1 flex-col items-end gap-1 text-right text-[6px]">
              <div className="relative h-6 w-24">
                <Image src="/signature.jpg" alt="Signature" fill sizes="96px" className="object-contain" />
              </div>
              <p>ออกบัตรโดย</p>
              <p className="uppercase">Safety Officer</p>
            </div>
          </div>
        </section>

        {/* Back side */}
        <section className="card-face card-face--back hidden aspect-[85.6/54] flex-col overflow-hidden bg-white print:flex print:max-w-none print:rounded-none print:border print:border-blue-900">
          <header className="flex items-center justify-center bg-[#0A2C84] px-6 py-8 text-white print:px-4 print:py-2">
            <h2 className="text-[14px] item-center font-semibold tracking-wide print:text-[8px] relative">เงื่อนไขและข้อปฏิบัติ</h2>
          </header>

          <article className="flex flex-1 flex-col justify-between px-6 py-5 text-black print:px-4 print:py-3">
            <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed print:space-y-1.5 print:text-[7px] print:leading-snug">
              {instructionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <div className="text-center text-sm print:px-3 print:py-2 print:text-[7px]">
              <p>*** ติดต่อแผนกความปลอดภัย ***</p>
              <p>โทร. 038-743-486-9 ต่อ 223</p>
            </div>
          </article>
        </section>
      </div>


    </div>
  )
}
