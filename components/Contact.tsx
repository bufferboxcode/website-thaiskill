'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const CONTACTS_COL = 'thaiskill_comments'
const isReady = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

export default function Contact() {
  const [cName,       setCName]       = useState('')
  const [cEmail,      setCEmail]      = useState('')
  const [cMsg,        setCMsg]        = useState('')
  const [sending,     setSending]     = useState(false)
  const [contactDone, setContactDone] = useState<boolean | null>(null)

  async function submitContact(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setContactDone(null)
    try {
      await Promise.race([
        addDoc(collection(db, CONTACTS_COL), {
          type:      'contact',
          name:      cName,
          email:     cEmail,
          message:   cMsg,
          createdAt: serverTimestamp(),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 10_000),
        ),
      ])
      setContactDone(true)
      setCName(''); setCEmail(''); setCMsg('')
    } catch (err) {
      console.error('[contact]', err)
      setContactDone(false)
    }
    setSending(false)
  }

  return (
    <section className="ct-section" id="contact">
      <div className="ct-inner">

        <div className="ct-top">
          <h2 className="ct-heading">ติดต่อเรา</h2>
          <p className="ct-sub">สนใจหลักสูตรหรือต้องการข้อมูลเพิ่มเติม? ทีมงาน ThaiSkill พร้อมตอบทุกคำถามของคุณ</p>
        </div>

        {/* ── Contact card — full width ── */}
        <div className="ct-grid ct-grid-single">
          <div className="ct-card">
            <div className="ct-card-header">
              <h3 className="ct-card-title">ส่งข้อความถึงเรา</h3>
              <button className="ct-share-btn" aria-label="แชร์">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
            <p className="ct-card-sub">มีคำถามเกี่ยวกับหลักสูตร การพัฒนาบุคลากร หรืออยากร่วมงานกับเรา? กรอกข้อมูลด้านล่างแล้วทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>

            {!isReady && (
              <p className="ct-feedback ct-err" style={{ marginBottom: 16 }}>
                ⚠️ Firebase ยังไม่ได้ตั้งค่า — กรุณาเพิ่ม NEXT_PUBLIC_FIREBASE_* ใน Vercel
              </p>
            )}

            <form className="ct-form" onSubmit={submitContact}>
              <div className="ct-field">
                <span className="ct-field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input className="ct-input" type="text" placeholder="ชื่อ - นามสกุล"
                  value={cName} onChange={e => setCName(e.target.value)} required />
              </div>

              <div className="ct-field">
                <span className="ct-field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2 4 12 13 22 4"/>
                  </svg>
                </span>
                <input className="ct-input" type="email" placeholder="อีเมล กฟภ. (@pea.co.th)"
                  value={cEmail} onChange={e => setCEmail(e.target.value)} required />
              </div>

              <div className="ct-field ct-field-area">
                <span className="ct-field-icon ct-field-icon-top">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <textarea className="ct-input" placeholder="ข้อความ / คำถาม / ข้อเสนอแนะ" rows={5}
                  value={cMsg} onChange={e => setCMsg(e.target.value)} required />
              </div>

              {contactDone === true  && <p className="ct-feedback ct-ok">✓ ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>}
              {contactDone === false && <p className="ct-feedback ct-err">✕ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>}

              <button className="ct-btn" type="submit" disabled={sending || !isReady}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {sending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
              </button>
            </form>
          </div>
        </div>

      </div>

      <div className="ct-footer-bar">
        <span>© {new Date().getFullYear()} ThaiSkill · กฟภ. · สงวนลิขสิทธิ์</span>
      </div>
    </section>
  )
}
