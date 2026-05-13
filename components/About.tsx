'use client'

import { useEffect } from 'react'

const marqueeWords = [
  'Upskill', 'Reskill', 'Future Workforce', 'Digital Transformation',
  'AI Literacy', 'Leadership', 'Energy Innovation', 'Human Capital',
  'ThaiSkill', 'กฟภ.', 'Smart Learning', 'Next Generation', 'Sustainability',
]

export default function About() {
  useEffect(() => {
    // 1. Scroll-reveal for about elements
    const aboutEls = [
      document.getElementById('aEyebrow'),
      document.getElementById('aHeadline'),
      document.getElementById('aDesc'),
      document.getElementById('aStats'),
      document.getElementById('aActions'),
      document.getElementById('aRight'),
    ]

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal')
          aboutObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    aboutEls.forEach(el => { if (el) aboutObserver.observe(el) })

    // 2. Word flip animation
    const wordTrack = document.getElementById('wordTrack')
    const wordItems = wordTrack ? wordTrack.querySelectorAll('.word-flip-item') : []
    let wordIndex = 0

    let wordInterval: ReturnType<typeof setInterval> | null = null
    if (wordTrack && wordItems.length) {
      wordInterval = setInterval(() => {
        wordIndex = (wordIndex + 1) % wordItems.length
        ;(wordTrack as HTMLElement).style.transform = `translateY(-${wordIndex * 1.2}em)`
      }, 2200)
    }

    // 3. Stat counters (count up when in view)
    const statNums = document.querySelectorAll<HTMLElement>('.about-stat-num[data-target]')
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const target = +(el.dataset.target || 0)
        const suffix = el.querySelector('span') ? el.querySelector('span')!.outerHTML : ''
        const duration = 1600
        const start = performance.now()
        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          el.innerHTML = Math.floor(ease * target).toLocaleString('th-TH') + suffix
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        statObserver.unobserve(el)
      })
    }, { threshold: 0.5 })

    statNums.forEach(el => statObserver.observe(el))

    // 4. Marquee content
    const marqueeEl = document.getElementById('aboutMarquee')
    if (marqueeEl) {
      const track = marqueeWords.map(w => `<span class="about-marquee-item">${w}</span>`).join('')
      marqueeEl.innerHTML = track + track
    }

    return () => {
      aboutObserver.disconnect()
      statObserver.disconnect()
      if (wordInterval) clearInterval(wordInterval)
    }
  }, [])

  return (
    <section className="about-section" id="about">
      <div className="about-grain"></div>
      <div className="about-orb about-orb-1"></div>
      <div className="about-orb about-orb-2"></div>
      <div className="about-orb about-orb-3"></div>

      <div className="about-inner">
        {/* Left */}
        <div className="about-left">
          <div className="about-eyebrow" id="aEyebrow">
            <span className="about-eyebrow-line"></span>
            เกี่ยวกับหน่วยธุรกิจเรา
          </div>

          <h2 className="about-headline" id="aHeadline">
            ปั้นคนไทยให้พร้อมรับ<br />
            <div className="word-flip-wrap">
              <div className="word-flip-track" id="wordTrack">
                <span className="word-flip-item">อนาคตของงาน</span>
                <span className="word-flip-item">Workforce 4.0</span>
                <span className="word-flip-item">ทักษะที่โลกต้องการ</span>
                <span className="word-flip-item">การเปลี่ยนแปลงทุกรูปแบบ</span>
                <span className="word-flip-item">โอกาสในยุคดิจิทัล</span>
              </div>
            </div>
          </h2>

          <p className="about-desc" id="aDesc">
            <span className="about-highlight">ThaiSkill</span> คือหน่วยธุรกิจนวัตกรรมการเรียนรู้ของ{' '}
            <span className="about-highlight">การไฟฟ้าส่วนภูมิภาค (กฟภ.)</span> ที่ไม่ใช่แค่การอบรม —{' '}
            แต่คือการ <span className="about-highlight">Upskill &amp; Reskill</span> บุคลากรอย่างเป็นระบบ{' '}
            ให้พร้อมนำทุกคลื่นความเปลี่ยนแปลง ด้วยหลักสูตรที่ตอบโจทย์ตลาดแรงงานแห่งอนาคต
          </p>

          <div className="about-stats" id="aStats">
            <div className="about-stat-item">
              <div className="about-stat-num" data-target="5000">0<span>+</span></div>
              <div className="about-stat-label">ผู้เข้ารับการพัฒนา</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-num" data-target="120">0<span>+</span></div>
              <div className="about-stat-label">หลักสูตรอบรม</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-num" data-target="98">0<span>%</span></div>
              <div className="about-stat-label">ความพึงพอใจ</div>
            </div>
          </div>

          <div className="about-actions" id="aActions">
            <button className="about-btn-primary">สำรวจหลักสูตร</button>
            <button className="about-btn-secondary">ดาวน์โหลดโบรชัวร์</button>
          </div>
        </div>

        {/* Right — orbit */}
        <div className="about-right" id="aRight">
          <div className="orbit-ring orbit-ring-1"></div>
          <div className="orbit-ring orbit-ring-2"></div>
          <div className="orbit-ring orbit-ring-3"></div>

          <div className="skill-center">
            <img src="/thaiskill-logo.svg" alt="ThaiSkill" style={{filter:'brightness(10) saturate(0)', height:'48px', width:'auto'}} />
          </div>

          <div className="skill-tags-container">
            <div className="skill-tag">AI &amp; Data</div>
            <div className="skill-tag">Digital Literacy</div>
            <div className="skill-tag">Leadership</div>
            <div className="skill-tag">Cybersecurity</div>
            <div className="skill-tag">Cloud Computing</div>
            <div className="skill-tag">Soft Skills</div>
            <div className="skill-tag">IoT &amp; Automation</div>
            <div className="skill-tag">Project Mgmt</div>
            <div className="skill-tag">Energy Tech</div>
            <div className="skill-tag">Finance &amp; ERP</div>
            <div className="skill-tag">Sustainability</div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="about-marquee-wrap">
        <div className="about-marquee-track" id="aboutMarquee"></div>
      </div>
    </section>
  )
}
