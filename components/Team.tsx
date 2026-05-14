'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const EXECUTIVES = [
  {
    name: 'ผู้อำนวยการ',
    role: 'School Director',
    tags: ['Leadership', 'Vision'],
    img: null,
    badge: 'DIRECTOR',
    placeholder: true,
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Chief Operating Officer',
    tags: ['Operations', 'Process'],
    img: '/images/team3.png',
    badge: 'COO',
  },
]

const TEAM = [
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Chief Executive Officer',
    tags: ['Strategy', 'Leadership'],
    img: '/images/team1.jpg',
    badge: 'CEO',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Chief Technology Officer',
    tags: ['AI', 'Innovation'],
    img: '/images/team2.png',
    badge: 'CTO',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Head of Business',
    tags: ['Business Dev', 'Sales'],
    img: '/images/team4.png',
    badge: 'BUSINESS',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Head of Product',
    tags: ['Product', 'UX Design'],
    img: '/images/team5.png',
    badge: 'PRODUCT',
  },
]

export default function Team() {
  useEffect(() => {
    const els = document.querySelectorAll('.tm-reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('vis'), i * 90)
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="tm-section" id="team">

      {/* ── Decorative background nodes ── */}
      <div className="tm-bg-grid" aria-hidden="true" />
      <div className="tm-orb tm-orb-1" aria-hidden="true" />
      <div className="tm-orb tm-orb-2" aria-hidden="true" />
      <div className="tm-orb tm-orb-3" aria-hidden="true" />

      <div className="tm-inner">

        {/* ── Header ── */}
        <div className="tm-header tm-reveal">
          <span className="tm-eyebrow">
            <span className="tm-eyebrow-dot" />
            TEAM · THAISKILL
          </span>
          <h2 className="tm-title">
            ทีมที่ขับเคลื่อน<br />
            <span className="tm-title-accent">อนาคตด้วย AI</span>
          </h2>
          <p className="tm-sub">
            นักสร้างโลกเทคโนโลยีที่ผสานปัญญาประดิษฐ์เข้ากับการศึกษา
          </p>
        </div>

        {/* ══ MANAGEMENT tier ══ */}
        <div className="tm-tier-label tm-reveal">
          <span className="tm-tier-line" />
          <span className="tm-tier-text">LEADERSHIP &amp; MANAGEMENT</span>
          <span className="tm-tier-line" />
        </div>

        <div className="tm-row tm-row-exec tm-reveal">
          {EXECUTIVES.map((m, i) => (
            <div key={i} className={`tm-card tm-card-exec${m.placeholder ? ' tm-card-placeholder' : ''}`}>
              {/* Glow ring */}
              <div className="tm-ring" />

              {/* Badge */}
              <span className="tm-badge">{m.badge}</span>

              {/* Avatar */}
              <div className="tm-avatar tm-avatar-lg">
                {m.placeholder ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                    <span className="tm-placeholder-label">รอประกาศ</span>
                  </>
                ) : (
                  <Image src={m.img!} alt={m.name} width={160} height={160} />
                )}
              </div>

              {/* Info */}
              <div className="tm-name">{m.name}</div>
              <div className="tm-role">{m.role}</div>
              <div className="tm-tags">
                {m.tags.map(t => <span key={t} className="tm-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* ══ TEAM tier ══ */}
        <div className="tm-tier-label tm-reveal" style={{ marginTop: '64px' }}>
          <span className="tm-tier-line" />
          <span className="tm-tier-text">OUR TEAM</span>
          <span className="tm-tier-line" />
        </div>

        <div className="tm-row tm-row-team tm-reveal">
          {TEAM.map((m, i) => (
            <div key={i} className="tm-card tm-card-team">
              <div className="tm-ring" />
              <span className="tm-badge tm-badge-team">{m.badge}</span>
              <div className="tm-avatar tm-avatar-md">
                <Image src={m.img} alt={m.name} width={140} height={140} />
              </div>
              <div className="tm-name">{m.name}</div>
              <div className="tm-role">{m.role}</div>
              <div className="tm-tags">
                {m.tags.map(t => <span key={t} className="tm-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
