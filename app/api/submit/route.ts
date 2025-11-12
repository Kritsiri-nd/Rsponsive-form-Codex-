import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { z } from 'zod'

const BodySchema = z.object({
  full_name: z.string(),
  company: z.string(),
  company_short: z.string(),   // ใช้สร้าง prefix
  department: z.string(),
  citizen_id: z.string(),
  score: z.number(),
  total: z.number(),
  percent: z.number(),
  issued_date: z.string(),
  expired_date: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    console.log("✅ BODY RECEIVED =", json)

    const parse = BodySchema.safeParse(json)
    if (!parse.success) {
      console.log("❌ ZOD ERROR =", parse.error)
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    const d = parse.data
    const prefix = d.company_short
    console.log("✅ prefix =", prefix)

    // ✅ 1) หา card_no ล่าสุด เช่น MCS012
    const { data: last } = await supabaseAdmin
      .from('submissions')
      .select('card_no')
      .like('card_no', `${prefix}%`)
      .order('card_no', { ascending: false })
      .limit(1)

    console.log("✅ last =", last)

    let next = 1
    if (last && last.length > 0 && last[0].card_no) {
      const num = Number(last[0].card_no.replace(prefix, ''))
      if (!isNaN(num)) next = num + 1
    }

    // ✅ 2) สร้างเลขใหม่ เช่น MCS001 / LTP017 / AFS003
    const newCardNo = `${prefix}${String(next).padStart(3, '0')}`
    console.log("✅ NEW CARD_NO =", newCardNo)

    // ✅ 3) Insert (ไม่แตะ id = uuid)
    const { error } = await supabaseAdmin
      .from('submissions')
      .insert({
        card_no: newCardNo,
        full_name: d.full_name,
        company: d.company,
        department: d.department,
        citizen_id: d.citizen_id,
        score: d.score,
        issued_date: d.issued_date,
        expired_date: d.expired_date,
        viewed: false,
      })

    if (error) {
      console.log("❌ INSERT ERROR =", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("✅ INSERT OK")
    return NextResponse.json({ ok: true })

  } catch (error: unknown) {
    console.log("❌ SERVER ERROR =", error)
    const message = error instanceof Error ? error.message : 'unexpected_error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
