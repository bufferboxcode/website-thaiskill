import { NextRequest, NextResponse } from 'next/server'

// Published CSV URL of the Google Sheet — used for reading comments
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7_pREWe1r1Lrou4aNsrqk0V7M1NbdZX2OTj54DPfgIBBEG1UlrAEnzu28yq-KsGAuL2Vp1HOmztVu/pub?output=csv'

// GAS Web App URL — used for writing new comments (set in Vercel env vars)
const GAS_URL = process.env.GAS_URL || ''

function parseCommentCSV(csv: string) {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  // Skip header row (Timestamp, Name, Message)
  return lines
    .slice(1)
    .map(line => {
      const parts = line.split(',')
      const timestamp = parts[0]?.trim().replace(/^"|"$/g, '') || ''
      const name      = parts[1]?.trim().replace(/^"|"$/g, '') || ''
      const message   = parts.slice(2).join(',').trim().replace(/^"|"$/g, '') || ''
      return { timestamp, name, message }
    })
    .filter(c => c.name && c.message)
    .reverse()
}

export async function GET() {
  try {
    const res = await fetch(SHEET_CSV_URL + '&nocache=' + Date.now(), {
      next: { revalidate: 30 },
    })
    if (!res.ok) return NextResponse.json([])
    const csv = await res.text()
    return NextResponse.json(parseCommentCSV(csv))
  } catch {
    return NextResponse.json([])
  }
}

async function postToGAS(payload: object) {
  const body = JSON.stringify(payload)
  let res = await fetch(GAS_URL, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  })
  if (res.status === 301 || res.status === 302) {
    const location = res.headers.get('location')
    if (location) {
      res = await fetch(location, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      })
    }
  }
  return res
}

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()
    if (!name || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!GAS_URL) {
      return NextResponse.json({ error: 'GAS_URL not configured' }, { status: 503 })
    }
    const res = await postToGAS({ type: 'comment', name, message })
    if (!res.ok && res.status !== 0) throw new Error('GAS error ' + res.status)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/comments]', err)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
}
