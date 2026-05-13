'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function Team() {
  useEffect(() => {
    const teamCards = document.querySelectorAll('.team-card')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    teamCards.forEach(card => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="team-section" id="team">
      <div className="section-eyebrow">ทีมผู้เชี่ยวชาญ</div>
      <h2 className="section-title">คนที่ขับเคลื่อน<br />Thai Skill</h2>
      <p className="section-sub">ทีมงานมืออาชีพที่มีประสบการณ์และความเชี่ยวชาญในทุกด้าน</p>

      <div className="team-grid">
        {/* Row 1 — 3 cards */}
        <div className="team-card float-1">
          <div className="team-photo">
            <Image src="/images/team1.jpg" alt="ทีมงาน 1" width={400} height={533} loading="lazy" />
          </div>
          <div className="team-info">
            <div className="team-name">ชื่อ - นามสกุล</div>
            <div className="team-role">Chief Executive Officer</div>
            <div className="team-divider"></div>
            <div className="team-tags">
              <span className="team-tag">Strategy</span>
              <span className="team-tag">Leadership</span>
            </div>
          </div>
        </div>

        <div className="team-card float-2">
          <div className="team-photo">
            <Image src="/images/team2.png" alt="ทีมงาน 2" width={400} height={533} loading="lazy" />
          </div>
          <div className="team-info">
            <div className="team-name">ชื่อ - นามสกุล</div>
            <div className="team-role">Chief Technology Officer</div>
            <div className="team-divider"></div>
            <div className="team-tags">
              <span className="team-tag">Technology</span>
              <span className="team-tag">Innovation</span>
            </div>
          </div>
        </div>

        <div className="team-card float-3">
          <div className="team-photo">
            <Image src="/images/team3.png" alt="ทีมงาน 3" width={400} height={533} loading="lazy" />
          </div>
          <div className="team-info">
            <div className="team-name">ชื่อ - นามสกุล</div>
            <div className="team-role">Chief Operating Officer</div>
            <div className="team-divider"></div>
            <div className="team-tags">
              <span className="team-tag">Operations</span>
              <span className="team-tag">Process</span>
            </div>
          </div>
        </div>

        {/* Row 2 — 2 cards centered */}
        <div className="team-row2">
          <div className="team-card float-4">
            <div className="team-photo">
              <Image src="/images/team4.png" alt="ทีมงาน 4" width={400} height={533} loading="lazy" />
            </div>
            <div className="team-info">
              <div className="team-name">ชื่อ - นามสกุล</div>
              <div className="team-role">Head of Business</div>
              <div className="team-divider"></div>
              <div className="team-tags">
                <span className="team-tag">Business Dev</span>
                <span className="team-tag">Sales</span>
              </div>
            </div>
          </div>

          <div className="team-card float-5">
            <div className="team-photo">
              <Image src="/images/team5.png" alt="ทีมงาน 5" width={400} height={533} loading="lazy" />
            </div>
            <div className="team-info">
              <div className="team-name">ชื่อ - นามสกุล</div>
              <div className="team-role">Head of Product</div>
              <div className="team-divider"></div>
              <div className="team-tags">
                <span className="team-tag">Product</span>
                <span className="team-tag">Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
