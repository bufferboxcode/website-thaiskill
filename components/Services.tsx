'use client'

import { useState } from 'react'

const books = [
  {
    id: 'pea-academy',
    spine: 'PEA  ACADEMY',
    colorTop: '#3d6b4a',
    colorMid: '#2a5038',
    colorBot: '#1c3827',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    badge: 'Live',
    title: 'PEA Academy',
    subtitle: 'พัฒนาบุคลากรการไฟฟ้าส่วนภูมิภาค',
    desc: 'หลักสูตรพัฒนาทักษะและความรู้สำหรับบุคลากร PEA ครอบคลุมทั้งด้านเทคนิค การจัดการ และ Digital Literacy เพื่อรองรับการเปลี่ยนแปลงในยุคดิจิทัล',
    tags: ['หลักสูตรอบรม', 'e-Learning', 'Workshop', 'Upskill'],
    cta: 'ดูหลักสูตร',
  },
  {
    id: 'pea-climate',
    spine: 'PEA  CLIMATE  SCHOOL',
    colorTop: '#2e4a6b',
    colorMid: '#1e3550',
    colorBot: '#142338',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22V12"/>
        <path d="M12 12C12 7 7 4 2 6"/>
        <path d="M12 12C12 7 17 4 22 6"/>
        <path d="M12 17c-3 0-6-2-6-5"/>
        <path d="M12 17c3 0 6-2 6-5"/>
      </svg>
    ),
    badge: 'Live',
    title: 'PEA Climate School',
    subtitle: 'โรงเรียนด้านภูมิอากาศและพลังงาน',
    desc: 'โครงการการศึกษาด้านการเปลี่ยนแปลงสภาพภูมิอากาศ คาร์บอนเครดิต และพลังงานสะอาด สำหรับบุคลากรและชุมชน มุ่งสู่ความยั่งยืนและ Net Zero 2065',
    tags: ['Carbon Credit', 'พลังงานสะอาด', 'ESG', 'Net Zero'],
    cta: 'เรียนรู้เพิ่มเติม',
  },
  {
    id: 'expertise',
    spine: 'EXPERTISE  THAISKILL',
    colorTop: '#8b5e2a',
    colorMid: '#6b4418',
    colorBot: '#4a2e0e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    badge: 'Live',
    title: 'Expertise ThaiSkill',
    subtitle: 'บริการที่ปรึกษาและฝึกอบรมผู้เชี่ยวชาญ',
    desc: 'บริการให้คำปรึกษาและฝึกอบรมจากผู้เชี่ยวชาญ ThaiSkill ทั้งด้านเทคนิค วิศวกรรม และการพัฒนาองค์กร ด้วยประสบการณ์กว่า 20 ปีในอุตสาหกรรมพลังงานไทย',
    tags: ['Consulting', 'Training', 'Engineering', 'R&D'],
    cta: 'ติดต่อผู้เชี่ยวชาญ',
  },
]

export default function Services() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="services" className="services-section">
      <div className="services-inner">

        <div className="services-header">
          <span className="services-eyebrow">
            <span className="eyebrow-dot"></span>
            บริการของเรา
          </span>
          <h2 className="services-title">
            ขับเคลื่อนธุรกิจ<br />
            <strong>ด้วยความเชี่ยวชาญ</strong>
          </h2>
          <p className="services-sub">คลิกที่หนังสือเพื่อดูรายละเอียดบริการ</p>
        </div>

        <div className="bookshelf-stage">
          {books.map((book) => {
            const isActive = active === book.id
            const isInactive = active !== null && !isActive
            return (
              <div
                key={book.id}
                className={`book-item${isActive ? ' active' : ''}${isInactive ? ' inactive' : ''}`}
                style={{
                  background: `linear-gradient(170deg, ${book.colorTop} 0%, ${book.colorMid} 55%, ${book.colorBot} 100%)`,
                }}
                onClick={() => setActive(isActive ? null : book.id)}
              >
                {/* Spine texture lines */}
                <div className="book-texture" />
                {/* Left binding shadow */}
                <div className="book-binding" />

                {/* ── Spine view (collapsed) ── */}
                <div className="book-spine-view">
                  <div className="spine-top">
                    <div className="spine-icon-ring">
                      {book.icon}
                    </div>
                  </div>
                  <span className="spine-title">{book.spine}</span>
                  <div className="spine-bottom">
                    <span className="spine-live-dot" />
                    <span className="spine-live-text">{book.badge}</span>
                  </div>
                </div>

                {/* ── Face view (expanded) ── */}
                <div className="book-face-view">
                  <div className="face-top-row">
                    <span className="face-badge">
                      <span className="face-badge-dot" />
                      {book.badge}
                    </span>
                    <button
                      className="face-close"
                      onClick={e => { e.stopPropagation(); setActive(null) }}
                      aria-label="ปิด"
                    >✕</button>
                  </div>

                  <div className="face-icon-wrap">
                    {book.icon}
                  </div>

                  <h3 className="face-title">{book.title}</h3>
                  <p className="face-subtitle">— {book.subtitle} —</p>
                  <p className="face-desc">{book.desc}</p>

                  <div className="face-tags">
                    {book.tags.map(t => (
                      <span key={t} className="face-tag">{t}</span>
                    ))}
                  </div>

                  <button className="face-cta">{book.cta} →</button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
