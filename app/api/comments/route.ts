import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || ''

const headers = () => ({
  'apikey':        SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
})

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return NextResponse.json([])

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?select=name,message,created_at&order=created_at.desc&limit=100`,
      { headers: headers(), next: { revalidate: 30 } },
    )
    if (!res.ok) return NextResponse.json([])

    const rows: { name: string; message: string; created_at: string }[] = await res.json()
    return NextResponse.json(
      rows.map(r => ({
        name:      r.name,
        message:   r.message,
        timestamp: new Date(r.created_at).toLocaleDateString('th-TH', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
      })),
    )
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()

    if (!name || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, message }),
    })

    if (!res.ok) throw new Error(await res.text())
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/comments]', err)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
}
