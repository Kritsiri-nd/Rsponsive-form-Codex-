import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const BodySchema = z.object({
  full_name: z.string().min(3),
  age: z.number().int().min(0).max(120).optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  image_url: z.string().url().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parse = BodySchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('submissions').insert(parse.data)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}


