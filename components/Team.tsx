'use client'

import { useEffect } from 'react'
import Image from 'next/image'

type Member = {
  name: string
  role: string
  tags: string[]
  img: string | null
  badge: string
  placeholder?: boolean
}

const EXECUTIVES: Member[] = [
  {
    name: 'ชื่อ - นามสกุล',
    role: 'ThaiSkill BU Head',
    tags: ['Leadership', 'Vision'],
    img: '/images/bu-head.png',
    badge: 'THAISKILL BU HEAD',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'BD Lead',
    tags: ['Business Dev', 'Sales'],
    img: '/images/bd-lead.png',
    badge: 'BD LEAD',
  },
]

const TEAM: Member[] = [
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Team Member',
    tags: ['ThaiSkill'],
    img: '/images/member2.png',
    badge: 'TEAM',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Team Member',
    tags: ['ThaiSkill'],
    img: '/images/member4.png',
    badge: 'TEAM',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Team Member',
    tags: ['ThaiSkill'],
    img: '/images/member1.png',
    badge: 'TEAM',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Team Member',
    tags: ['ThaiSkill'],
    img: '/images/member5.png',
    badge: 'TEAM',
  },
  {
    name: 'ชื่อ - นามสกุล',
    role: 'Team Member',
    tags: ['ThaiSkill'],
    img: '/images/member3.png',
    badge: 'TEAM',
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
            ทีมที่ออกแบบอนาคต<br />
            <span className="tm-title-accent">ด้านการพัฒนาบุคลากรของ กฟภ.</span>
          </h2>
          <p className="tm-sub">
            เราพัฒนาหลักสูตรที่ทำให้บุคลากร กฟภ. Upskill &amp; Reskill ได้จริง<br />
            เพราะโลกเปลี่ยนเร็ว — คนต้องเปลี่ยนทัน
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
            <div key={i} className={`tm-card tm-card-exec${i === 0 ? ' tm-card-bu-head' : ''}`}>
              {/* Glow ring */}
              <div className={`tm-ring${i === 0 ? ' tm-ring-bu-head' : ''}`} />

              {/* Badge */}
              <span className={`tm-badge${i === 0 ? ' tm-badge-bu-head' : ''}`}>{m.badge}</span>

              {/* Avatar */}
              <div className={`tm-avatar tm-avatar-lg${i === 0 ? ' tm-avatar-bu-head' : ''}`}>
                <Image src={m.img!} alt={m.name} width={160} height={160} />
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
                <Image src={m.img!} alt={m.name} width={280} height={280} />
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
