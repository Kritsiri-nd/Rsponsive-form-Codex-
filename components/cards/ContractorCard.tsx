'use client'

import Image from 'next/image'


const printStyles = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    .contractor-card {
      width: 175.2mm !important;
      min-width: 175.2mm !important;
      max-width: 175.2mm !important;
      height: 54mm !important;
      min-height: 54mm !important;
      max-height: 54mm !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .contractor-card .card-sheet {
      width: 175.2mm !important;
      min-width: 175.2mm !important;
      max-width: 175.2mm !important;
      height: 54mm !important;
      min-height: 54mm !important;
      max-height: 54mm !important;
      gap: 4mm !important;
    }

    .contractor-card .card-face {
      width: 85.6mm !important;
      min-width: 85.6mm !important;
      max-width: 85.6mm !important;
      height: 54mm !important;
      min-height: 54mm !important;
      max-height: 54mm !important;
      font-size: 7px !important;
      line-height: 1.3 !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .contractor-card .card-face--front {
      border: 1px solid #44444E !important;
    }

    .contractor-card .card-face--back {
      border: 1px solid #44444E !important;
    }

    .card-face ol,
    .card-face ul {
      margin-top: 2mm !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      list-style-position: outside !important;
    }

    .card-face ol li,
    .card-face ul li {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      display: list-item !important;
      list-style-position: outside !important;
    }
  }
`

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
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="contractor-card overflow-hidden bg-white print:border-0 print:rounded-none print:shadow-none print:m-0 print:px-0">
        <div className="card-sheet mx-auto grid w-full max-w-[800px] gap-6 bg-white p-6 md:grid-cols-1 print:flex print:w-auto print:max-w-none print:p-0 print:bg-white">
          <section className="card-face card-face--front relative flex aspect-[85.6/54] w-full max-w-[800px] flex-col justify-between overflow-hidden bg-white print:max-w-none print:rounded-none print:border print:border-[#44444E]">

            <header className="flex items-center gap-4 bg-[#0A2C84] px-1 py-2 text-white reletive">
            <div className="flex flex-col items-center gap-3 absolute">
                <div className="h-3">
                  <Image
                    src="/Nittan-logo.jpg"
                    alt="Nittan logo"
                    width={300}
                    height={150}
                    className=" h-5 w-auto object-contain"
                  />
                </div>

                <div className="leading-tight text-white">
                  <p className="text-[5px] font-semibold tracking-wide">NITTAN (THAILAND) CO., LTD.</p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <p className="text-[12px] font-extrabold uppercase tracking-wide">CONTRACTOR CARD</p>
                <p className="text-[10px] font-medium">บัตรอนุญาตทำงานผู้รับเหมา</p>
              </div>
            </header>

            <div className="flex flex-1 gap-6 px-6">
              <div className="flex items-center justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#0A2C84] bg-white">
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

              <div className="flex flex-col justify-center gap-1 font-bold text-[9px]">
                <p className='text-[#0A2C84] '>เลขประจำตัวผู้รับเหมาฯ :</p>
                <p className="text-[14px] text-black">{cardNo}</p>
                <p className='text-[#0A2C84]'>
                  ชื่อ - นามสกุล : <span className="text-black">{fullName}</span>
                </p>
                <p className='text-[#0A2C84]'>
                  ชื่อบริษัท : <span className="uppercase text-black">{companyName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10 px-8 pb-3 pt-2 text-black">
              <div className="flex-1 text-[7px]">
                <p className="text-center font-bold">{issuedDate ?? '-'}</p>
                <p className='text-center font-bold'>วันที่ออกบัตร</p>
              </div>
              <div className="flex-1 text-[7px]">
                <p className="font-bold text-center">{expiredDate ?? '-'}</p>
                <p className='text-center font-bold'>วันหมดอายุ</p>
              </div>
              <div className="flex-1 text-[7px] relative">
                <Image
                  src="/signature-no-bg.png"
                  alt="signature"
                  width={300}
                  height={150}
                  className="h-10 w-auto object-contain mb-1 absolute bottom-2 -right-0.5"
                />
                <p className='text-center font-bold'>ออกบัตรโดย</p>
                <p className="uppercase text-center font-bold">Safety Officer</p>
              </div>
            </div>
          </section>

          {/* Back side */}
          <section className=" card-face--back hidden aspect-[85.6/54] flex-col overflow-hidden bg-white print:flex print:max-w-none print:rounded-none print:border print:border-[#44444E] print:overflow-visible">
            <header className="flex items-center justify-center bg-[#0A2C84] px-6 py-8 text-white print:px-4 print:py-2">
              <h2 className="text-[20px] item-center font-semibold tracking-wide print:text-[8px] relative">เงื่อนไขและข้อปฏิบัติ</h2>
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
    </>
  )
}
