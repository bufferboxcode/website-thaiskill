import { NextRequest, NextResponse } from 'next/server'

const GAS_URL = process.env.GAS_URL || ''

async function postToGAS(payload: object) {
  const body = JSON.stringify(payload)
  // GAS Web Apps may redirect; follow manually to preserve POST method
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
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!GAS_URL) {
      return NextResponse.json({ error: 'GAS_URL not configured' }, { status: 503 })
    }
    const res = await postToGAS({ type: 'contact', name, email, message })
    if (!res.ok && res.status !== 0) throw new Error('GAS error ' + res.status)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/contact]', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
