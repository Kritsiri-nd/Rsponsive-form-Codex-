import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !/^https?:\/\//.test(url)) {
  throw new Error('Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local and restart dev server.')
}
if (!anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local and restart dev server.')
}

export const supabase = createClient(url, anonKey)


