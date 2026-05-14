'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const COO = {
  name: 'ชื่อ - นามสกุล',
  role: 'Chief Operating Officer',
  tags: ['Operations', 'Process'],
  img: '/images/team3.png',
}

const MEMBERS = [
  { name: 'ชื่อ - นามสกุล', role: 'Chief Executive Officer',  tags: ['Strategy', 'Leadership'],   img: '/images/team1.jpg' },
  { name: 'ชื่อ - นามสกุล', role: 'Chief Technology Officer', tags: ['Technology', 'Innovation'],  img: '/images/team2.png' },
  { name: 'ชื่อ - นามสกุล', role: 'Head of Business',         tags: ['Business Dev', 'Sales'],     img: '/images/team4.png' },
  { name: 'ชื่อ - นามสกุล', role: 'Head of Product',          tags: ['Product', 'Design'],         img: '/images/team5.png' },
]

export default function Team() {
  useEffect(() => {
    const els = document.querySelectorAll('.org-reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('vis'), i * 100)
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="org-section" id="team">

      {/* ── Header ── */}
      <div className="org-header org-reveal">
        <span className="org-eyebrow">
          <span className="eyebrow-dot" />
          โครงสร้างทีมงาน
        </span>
        <h2 className="org-title">คนที่ขับเคลื่อน <strong>Thai Skill</strong></h2>
        <p className="org-sub">ทีมงานมืออาชีพพร้อมขับเคลื่อน ThaiSkill สู่อนาคต</p>
      </div>

      <div className="org-chart">

        {/* ══ Level 1 — ผู้อำนวยการโรงเรียน (placeholder) ══ */}
        <div className="org-level org-reveal">
          <div className="org-node director-node">
            <span className="org-badge badge-director">
              <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
              </svg>
              ผู้อำนวยการโรงเรียน
            </span>
            <div className="director-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span className="director-hint">รอประกาศ</span>
            </div>
            <div className="org-name">ผู้อำนวยการ</div>
            <div className="org-role-text">School Director</div>
          </div>
        </div>

        {/* Connector: Director → COO */}
        <div className="org-vline org-reveal">
          <div className="org-vline-dot" />
          <div className="org-vline-bar" />
          <div className="org-vline-dot" />
        </div>

        {/* ══ Level 2 — COO (หัวหน้าห้อง) ══ */}
        <div className="org-level org-reveal">
          <div className="org-node coo-node">
            <span className="org-badge badge-coo">
              <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              หัวหน้าห้อง
            </span>
            <div className="coo-avatar">
              <Image src={COO.img} alt={COO.name} width={110} height={110} />
            </div>
            <div className="org-name">{COO.name}</div>
            <div className="org-role-text accent">{COO.role}</div>
            <div className="org-tags-row">
              {COO.tags.map(t => <span key={t} className="org-tag">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Connector: COO → branch */}
        <div className="org-vline org-reveal">
          <div className="org-vline-dot" />
          <div className="org-vline-bar" />
        </div>
        <div className="org-hline org-reveal" />

        {/* ══ Level 3 — ทีมงาน ══ */}
        <div className="org-members-row org-reveal">
          {MEMBERS.map((m, i) => (
            <div key={i} className="org-member-col">
              <div className="org-dropline" />
              <div className="org-node member-node">
                <span className="org-badge badge-team">ทีมงาน</span>
                <div className="member-avatar">
                  <Image src={m.img} alt={m.name} width={80} height={80} />
                </div>
                <div className="org-name sm">{m.name}</div>
                <div className="org-role-text sm">{m.role}</div>
                <div className="org-tags-row">
                  {m.tags.map(t => <span key={t} className="org-tag sm">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
