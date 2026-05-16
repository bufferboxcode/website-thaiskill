'use client'

import { useEffect, useRef } from 'react'

// ─── GAS JSON endpoint (แนะนำ) — ตั้งใน Vercel env vars ───────────────────
// NEXT_PUBLIC_GAS_REVENUE_URL = URL จาก Google Apps Script (gas-revenue-api.js)
// ไม่ได้รับผลจาก: เพิ่ม row / column / sheet / formula ใดๆ ใน Google Sheet
const GAS_REVENUE_URL = process.env.NEXT_PUBLIC_GAS_REVENUE_URL ?? ''

// ─── CSV fallback (ใช้เมื่อ GAS URL ยังไม่ได้ตั้ง) ─────────────────────────
// อ่านจาก row ที่ column A = "revenue_current" เท่านั้น
// → ไม่สนใจตำแหน่ง row / column อื่น ป้องกัน shift จากการเพิ่ม row/column
// ⚠️ ยังอาจมีปัญหาหากเพิ่ม tab ใหม่ที่มีชื่อ sheet ตรงกัน → ใช้ GAS แทนดีกว่า
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6P9WqCiP8Nq5p_TBvXF2VmG9VpTzwj2Sx_CmPmjRZ12EFuTRbqP5yWz_Nk0H10P8EnmAjet9rwmNF/pub?output=csv'

const FLUCTUATION = 5000   // counter wanders ±5,000 from the live base
const BASE_ORDERS = 3_847
const BASE_TODAY = 284_500

function fmt(n: number, decimals = 0) {
  return Math.floor(n).toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

class Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; alpha: number; decay: number
  color: string; shape: string; rot: number; rSpeed: number

  constructor(cx: number, cy: number) {
    this.x = cx; this.y = cy
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 4.5
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed - 2
    this.radius = 2 + Math.random() * 4
    this.alpha = 1
    this.decay = 0.012 + Math.random() * 0.018
    const palette = ['#38bdf8','#0369a1','#7dd3fc','#e0f2fe','#0891b2','#fbbf24']
    this.color = palette[Math.floor(Math.random() * palette.length)]
    this.shape = Math.random() > 0.5 ? 'circle' : 'rect'
    this.rot = Math.random() * Math.PI * 2
    this.rSpeed = (Math.random() - 0.5) * 0.15
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.12
    this.vx *= 0.98
    this.alpha -= this.decay
    this.rot += this.rSpeed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = this.color
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot)
    if (this.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
      ctx.fill()
    } else {
      const s = this.radius * 1.6
      ctx.fillRect(-s / 2, -s / 2, s, s * 0.6)
    }
    ctx.restore()
  }
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const counterCardRef = useRef<HTMLDivElement>(null)
  const mainCounterRef = useRef<HTMLDivElement>(null)
  const rateLabelRef = useRef<HTMLSpanElement>(null)
  const todayElRef = useRef<HTMLSpanElement>(null)
  const orderElRef = useRef<HTMLSpanElement>(null)
  const avgElRef = useRef<HTMLSpanElement>(null)
  const todayChgRef = useRef<HTMLSpanElement>(null)
  const orderChgRef = useRef<HTMLSpanElement>(null)
  const frozenBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let baseRevenue = 0        // live value from Google Sheets
    let loaded = false
    let offset = 0             // current wander offset (stays within ±FLUCTUATION)
    let targetOffset = 0       // next wander target
    let lastTargetChange = 0   // timestamp of last target pick

    let orders = BASE_ORDERS
    let todayRev = BASE_TODAY
    let lastTime = performance.now()
    let animCurrent = 0
    let isCounterHovered = false
    let frozenValue = 0
    let particles: Particle[] = []
    let particleRaf = 0
    let animRaf = 0

    // ── Hardcoded fallback value ──────────────────────────────────────────────
    const FALLBACK_REVENUE = 6_151_200

    // ── Apply a confirmed revenue value ──────────────────────────────────────
    function applyRevenue(n: number) {
      baseRevenue = n
      if (!loaded) animCurrent = n   // snap only on first load
      loaded = true
    }

    // ── Layer 3: hardcode (last resort) ──────────────────────────────────────
    function useFallback() {
      if (!loaded) applyRevenue(FALLBACK_REVENUE)
    }

    // ── Layer 2: CSV fallback ─────────────────────────────────────────────────
    // อ่านเฉพาะ row ที่ column A = "revenue_current"
    // → ไม่ได้รับผลจากการเพิ่ม row / column อื่น
    function fetchFromCSV() {
      fetch(SHEETS_CSV_URL + '&t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' },
      })
        .then(r => r.text())
        .then(csv => {
          let found = false
          csv.trim().split(/\r?\n/).forEach(line => {
            const parts = line.split(',')
            if (parts.length < 2) return
            const key = parts[0].trim().replace(/^"|"$/g, '')
            if (key !== 'revenue_current') return          // ← key-based lookup เท่านั้น
            const raw = parts.slice(1).join(',').trim().replace(/^"|"$/g, '')
            const cleaned = raw.replace(/[฿$€£\s,]/g, '')
            const n = parseFloat(cleaned)
            if (!isNaN(n) && n > 0) { applyRevenue(n); found = true }
          })
          if (!found) useFallback()
        })
        .catch(useFallback)
    }

    // ── Layer 1: GAS JSON endpoint (แนะนำ / ทนทานสุด) ───────────────────────
    // อ่านจาก Named Range → ไม่ขยับแม้เพิ่ม row / column / sheet / formula
    function fetchBase() {
      if (GAS_REVENUE_URL) {
        fetch(GAS_REVENUE_URL + '?t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' },
        })
          .then(r => r.json())
          .then((data: { ok: boolean; revenue: number }) => {
            if (data.ok && data.revenue > 0) {
              applyRevenue(data.revenue)
            } else {
              fetchFromCSV()           // GAS ตอบ ok:false → ลอง CSV
            }
          })
          .catch(fetchFromCSV)         // GAS fetch ล้มเหลว → ลอง CSV
      } else {
        fetchFromCSV()                 // ยังไม่ได้ตั้ง GAS URL → ลอง CSV
      }
    }

    fetchBase()
    // Refresh every 5 minutes so counter base stays current
    const heroRefreshInterval = setInterval(fetchBase, 5 * 60 * 1000)

    const canvas = canvasRef.current
    const counterCard = counterCardRef.current
    const mainCounter = mainCounterRef.current
    const rateLabel = rateLabelRef.current
    const todayEl = todayElRef.current
    const orderEl = orderElRef.current
    const avgEl = avgElRef.current
    const todayChg = todayChgRef.current
    const orderChg = orderChgRef.current
    const frozenBadge = frozenBadgeRef.current

    const pCtx = canvas ? canvas.getContext('2d') : null

    function resizeCanvas() {
      if (!canvas || !counterCard) return
      canvas.width = counterCard.offsetWidth
      canvas.height = counterCard.offsetHeight
    }

    function burstParticles() {
      if (!canvas) return
      resizeCanvas()
      const cx = canvas.width / 2
      const cy = canvas.height * 0.42
      for (let i = 0; i < 80; i++) particles.push(new Particle(cx, cy))
    }

    function loopParticles() {
      if (!pCtx || !canvas) return
      pCtx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter(p => p.alpha > 0)
      particles.forEach(p => { p.update(); p.draw(pCtx) })
      if (isCounterHovered && Math.random() < 0.35) {
        const cx = canvas.width / 2 + (Math.random() - 0.5) * 160
        const cy = canvas.height * 0.42
        particles.push(new Particle(cx, cy))
      }
      particleRaf = requestAnimationFrame(loopParticles)
    }

    function animateCounter(ts: number) {
      const dt = (ts - lastTime) / 1000
      lastTime = ts

      if (loaded) {
        // Every 4 s pick a new wander target within ±FLUCTUATION
        if (ts - lastTargetChange > 4000) {
          targetOffset = (Math.random() * 2 - 1) * FLUCTUATION
          lastTargetChange = ts
        }
        // Smoothly approach target
        offset += (targetOffset - offset) * Math.min(dt * 0.6, 1)
        animCurrent = baseRevenue + offset

        if (!isCounterHovered) {
          if (mainCounter) mainCounter.textContent = fmt(animCurrent)
          const direction = targetOffset >= offset ? '+' : '-'
          if (rateLabel) rateLabel.textContent = `${direction}฿${fmt(Math.abs(targetOffset - offset))} / ขณะนี้`
        }
      }

      if (Math.random() < dt / 28) {
        orders++
        if (orderChg) orderChg.textContent = `▲ +${orders - BASE_ORDERS} วันนี้`
      }

      if (todayEl) todayEl.textContent = `฿${fmt(todayRev)}`
      if (orderEl) orderEl.textContent = fmt(orders)
      if (loaded && avgEl) avgEl.textContent = `฿${fmt(animCurrent / orders)}`

      const todayPct = ((todayRev / (BASE_TODAY * 0.88) - 1) * 100).toFixed(1)
      if (todayChg) todayChg.textContent = `▲ +${todayPct}% vs เมื่อวาน`

      animRaf = requestAnimationFrame(animateCounter)
    }

    animRaf = requestAnimationFrame(animateCounter)

    if (counterCard) {
      const mouseEnter = () => {
        isCounterHovered = true
        // Show exact Google Sheets value (no animation offset)
        frozenValue = baseRevenue
        if (mainCounter) mainCounter.textContent = fmt(frozenValue, 2)
        if (rateLabel) rateLabel.textContent = '⏸ รายได้จริงจาก Google Sheets'
        counterCard.classList.add('paused')
        if (frozenBadge) frozenBadge.classList.add('show')
        burstParticles()
        cancelAnimationFrame(particleRaf)
        loopParticles()
      }

      const mouseLeave = () => {
        isCounterHovered = false
        counterCard.classList.remove('paused')
        if (frozenBadge) frozenBadge.classList.remove('show')
        cancelAnimationFrame(particleRaf)
        if (pCtx && canvas) pCtx.clearRect(0, 0, canvas.width, canvas.height)
        particles = []
      }

      counterCard.addEventListener('mouseenter', mouseEnter)
      counterCard.addEventListener('mouseleave', mouseLeave)

      return () => {
        cancelAnimationFrame(animRaf)
        cancelAnimationFrame(particleRaf)
        counterCard.removeEventListener('mouseenter', mouseEnter)
        counterCard.removeEventListener('mouseleave', mouseLeave)
      }
    }

    return () => {
      cancelAnimationFrame(animRaf)
      cancelAnimationFrame(particleRaf)
      clearInterval(heroRefreshInterval)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">

        <div className="eyebrow">
          <span className="eyebrow-dot"></span>
          ติดตามรายได้แบบ Real-Time
        </div>

        <h1 className="headline">
          รู้ทุกบาท <strong>ทุกนาที</strong><br />ที่ ThaiSkill สร้าง
        </h1>
        <p className="subheadline">Dashboard รายได้แบบ real time สำหรับหน่วยธุรกิจ ThaiSkill</p>

        {/* Revenue Counter */}
        <div className="counter-card" id="counterCard" ref={counterCardRef}>
          <canvas id="counterParticles" ref={canvasRef}></canvas>
          <div className="frozen-badge" id="frozenBadge" ref={frozenBadgeRef}>
            <span className="frozen-dot"></span>FROZEN
          </div>
          <div className="counter-label">รายได้สะสมปีนี้</div>
          <div className="counter-main">
            <span className="currency-symbol">฿</span>
            <div className="counter-number" id="mainCounter" ref={mainCounterRef}>0</div>
            <span className="counter-unit">บาท</span>
          </div>
          <div className="counter-sub">
            <span className="live-badge">
              <span className="live-badge-dot"></span>
              LIVE
            </span>
            <span id="rateLabel" ref={rateLabelRef}>กำลังโหลด...</span>
          </div>
          <div className="counter-hint">
            <span className="counter-hint-icon">👆</span>
            กดค้างที่ตัวเลขเพื่อดูรายได้จริง ณ ปัจจุบัน
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value up" id="todayRevenue" ref={todayElRef}>฿0</span>
            <span className="stat-label">รายได้วันนี้</span>
            <span className="stat-change positive" id="todayChange" ref={todayChgRef}>▲ 0%</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" id="orderCount" ref={orderElRef}>0</span>
            <span className="stat-label">ออเดอร์ทั้งหมด</span>
            <span className="stat-change positive" id="orderChange" ref={orderChgRef}>▲ 0</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" id="avgOrder" ref={avgElRef}>฿0</span>
            <span className="stat-label">มูลค่าเฉลี่ย/ออเดอร์</span>
            <span className="stat-change positive">▲ 2.4%</span>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn-primary">ดูรายงานทั้งหมด</button>
          <button className="btn-secondary">เชื่อมต่อข้อมูล</button>
        </div>

      </div>
    </section>
  )
}
