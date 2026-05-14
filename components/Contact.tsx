'use client'

import { useState } from 'react'

// ─── ใส่ Formspree Form ID ที่นี่ (ดูวิธีได้ด้านล่าง) ───────────
// 1. สมัคร formspree.io → New Form → คัดลอก ID (ส่วน /f/xxxxxxxx)
// 2. วางใส่ตัวแปรด้านล่าง แล้ว push ขึ้น Vercel
const CONTACT_ID  = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT  || ''
const COMMENTS_ID = process.env.NEXT_PUBLIC_FORMSPREE_COMMENTS || ''

function formspreeUrl(id: string) {
  return `https://formspree.io/f/${id}`
}

type Comment = { name: string; message: string; timestamp: string }

export default function Contact() {
  // Contact form state
  const [cName,  setCName]  = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cMsg,   setCMsg]   = useState('')
  const [sending,     setSending]     = useState(false)
  const [contactDone, setContactDone] = useState<boolean | null>(null)

  // Comments state (local — shows submitted comments immediately)
  const [cmtName, setCmtName] = useState('')
  const [cmtMsg,  setCmtMsg]  = useState('')
  const [comments,    setComments]    = useState<Comment[]>([])
  const [posting,     setPosting]     = useState(false)
  const [commentDone, setCommentDone] = useState<boolean | null>(null)

  // ── ส่ง Contact form ──────────────────────────────────────────
  async function submitContact(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setContactDone(null)
    try {
      const r = await fetch(formspreeUrl(CONTACT_ID), {
        method:  'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: cName, email: cEmail, message: cMsg }),
      })
      setContactDone(r.ok)
      if (r.ok) { setCName(''); setCEmail(''); setCMsg('') }
    } catch { setContactDone(false) }
    setSending(false)
  }

  // ── ส่ง Comment ───────────────────────────────────────────────
  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    setPosting(true)
    setCommentDone(null)
    try {
      const r = await fetch(formspreeUrl(COMMENTS_ID), {
        method:  'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: cmtName, message: cmtMsg }),
      })
      setCommentDone(r.ok)
      if (r.ok) {
        // เพิ่มขึ้นหน้าจอทันที (local optimistic)
        const ts = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
        setComments(prev => [{ name: cmtName, message: cmtMsg, timestamp: ts }, ...prev])
        setCmtName(''); setCmtMsg('')
      }
    } catch { setCommentDone(false) }
    setPosting(false)
  }

  return (
    <section className="ct-section" id="contact">
      <div className="ct-inner">

        <div className="ct-top">
          <h2 className="ct-heading">ติดต่อเรา</h2>
          <p className="ct-sub">มีคำถามหรือข้อเสนอแนะ? ส่งข้อความหาเราได้เลย เราจะตอบกลับโดยเร็ว</p>
        </div>

        <div className="ct-grid">

          {/* ── Left: Get in Touch ── */}
          <div className="ct-card">
            <div className="ct-card-header">
              <h3 className="ct-card-title">Get in Touch</h3>
              <button className="ct-share-btn" aria-label="แชร์">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
            <p className="ct-card-sub">Have something to discuss? Send us a message and let&apos;s talk.</p>

            <form className="ct-form" onSubmit={submitContact}>
              <div className="ct-field">
                <span className="ct-field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input className="ct-input" type="text" placeholder="Your Name"
                  value={cName} onChange={e => setCName(e.target.value)} required />
              </div>

              <div className="ct-field">
                <span className="ct-field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2 4 12 13 22 4"/>
                  </svg>
                </span>
                <input className="ct-input" type="email" placeholder="Your PEA Email"
                  value={cEmail} onChange={e => setCEmail(e.target.value)} required />
              </div>

              <div className="ct-field ct-field-area">
                <span className="ct-field-icon ct-field-icon-top">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <textarea className="ct-input" placeholder="Your Message" rows={5}
                  value={cMsg} onChange={e => setCMsg(e.target.value)} required />
              </div>

              {contactDone === true  && <p className="ct-feedback ct-ok">✓ ส่งข้อความสำเร็จแล้ว! เราจะติดต่อกลับเร็วๆ นี้</p>}
              {contactDone === false && <p className="ct-feedback ct-err">✕ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>}

              <button className="ct-btn" type="submit" disabled={sending || !CONTACT_ID}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {sending ? 'กำลังส่ง...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* ── Right: Comments ── */}
          <div className="ct-card">
            <div className="ct-cmt-header">
              <span className="ct-cmt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <h3 className="ct-cmt-title">Comments</h3>
              <span className="ct-cmt-count">{comments.length}</span>
            </div>

            <form className="ct-cmt-form" onSubmit={submitComment}>
              <div className="ct-cmt-field-wrap">
                <label className="ct-cmt-label">Name <span className="ct-required">*</span></label>
                <input className="ct-cmt-input" type="text" placeholder="Enter your name"
                  value={cmtName} onChange={e => setCmtName(e.target.value)} required />
              </div>
              <div className="ct-cmt-field-wrap">
                <label className="ct-cmt-label">Message <span className="ct-required">*</span></label>
                <textarea className="ct-cmt-input" placeholder="Write your message here..." rows={4}
                  value={cmtMsg} onChange={e => setCmtMsg(e.target.value)} required />
              </div>

              {commentDone === true  && <p className="ct-feedback ct-ok">✓ โพสต์สำเร็จ!</p>}
              {commentDone === false && <p className="ct-feedback ct-err">✕ เกิดข้อผิดพลาด กรุณาลองใหม่</p>}

              <button className="ct-btn" type="submit" disabled={posting || !COMMENTS_ID}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {posting ? 'กำลังโพสต์...' : 'Post Comment'}
              </button>
            </form>

            <div className="ct-cmt-list">
              {comments.length === 0 && (
                <p className="ct-cmt-empty">ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น!</p>
              )}
              {comments.map((c, i) => (
                <div key={i} className="ct-cmt-item">
                  <div className="ct-cmt-avatar">{(c.name || '?')[0].toUpperCase()}</div>
                  <div className="ct-cmt-body">
                    <div className="ct-cmt-meta">
                      <span className="ct-cmt-name">{c.name}</span>
                      <span className="ct-cmt-time">{c.timestamp}</span>
                    </div>
                    <p className="ct-cmt-text">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="ct-footer-bar">
        <span>© {new Date().getFullYear()} ThaiSkill · กฟภ. · สงวนลิขสิทธิ์</span>
      </div>
    </section>
  )
}
