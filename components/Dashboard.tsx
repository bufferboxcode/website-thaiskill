'use client'

import { useEffect, useRef } from 'react'

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6P9WqCiP8Nq5p_TBvXF2VmG9VpTzwj2Sx_CmPmjRZ12EFuTRbqP5yWz_Nk0H10P8EnmAjet9rwmNF/pub?output=csv'
const POLL_MS = 30000

const DB_DEFAULT = {
  revenue_current:         6151200,
  revenue_target:          50000000,
  projected_revenue:       15611400,
  operating_cost:          4022113.65,
  external_customers:      15,
  pea_customers:           11038,
  total_customers:         11053,
  total_customers_target:  10000,
  pea_internal_revenue:    15000000,
  pea_internal_target:     40000000,
  pea_external_revenue:    435000,
  pea_external_target:     6000000,
  carbon_external_revenue: 176400,
  carbon_external_target:  2000000,
  carbon_internal_revenue: 0,
  carbon_internal_target:  2000000,
  cost_other_ops:          226608.42,
  cost_actual_ops:         2853678.45,
  cost_depreciation:       1926.44,
  cost_employee_benefits:  70.63,
  cost_personnel:          929733.55,
}

type DbData = typeof DB_DEFAULT & Record<string, number | string>

const DB_ARC = 251

function dbFmt(n: number, dec = 2) {
  return Number(n).toLocaleString('th-TH', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}
function dbFmtInt(n: number) { return Number(n).toLocaleString('th-TH') }
function dbShort(n: number) {
  n = Number(n)
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return dbFmtInt(n)
}

function dbSetGauge(id: string, value: number, max: number) {
  const el = document.getElementById(id)
  if (!el) return
  const pct = max > 0 ? Math.min(value / max, 1) : 0
  ;(el as unknown as SVGPathElement).style.strokeDashoffset = String(DB_ARC * (1 - pct))
}

function dbCountUp(id: string, target: number, dec = 0) {
  const el = document.getElementById(id)
  if (!el) return
  const duration = 1400
  const t0 = performance.now()
  const fmtFn = dec > 0 ? (v: number) => dbFmt(v, dec) : (v: number) => dbFmtInt(v)
  const tick = (now: number) => {
    const p = Math.min((now - t0) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    el.textContent = fmtFn(target * ease)
    if (p < 1) requestAnimationFrame(tick)
    else el.textContent = fmtFn(target)
  }
  requestAnimationFrame(tick)
}

function parseCSV(csv: string): Record<string, number | string> {
  const data: Record<string, number | string> = {}
  csv.trim().split(/\r?\n/).forEach(line => {
    const parts = line.split(',')
    if (parts.length < 2) return
    const key = parts[0].trim().replace(/^"|"$/g, '')
    const raw = parts.slice(1).join(',').trim().replace(/^"|"$/g, '')
    // strip ฿ symbol, spaces, commas → parse number
    const cleaned = raw.replace(/[฿$€£\s,]/g, '')
    const num = parseFloat(cleaned)
    if (key) data[key] = isNaN(num) ? raw : num
  })
  return data
}

function dbRender(data: Partial<DbData>) {
  const d = Object.assign({}, DB_DEFAULT, data) as DbData

  dbCountUp('dbRevenueCurrent', Number(d.revenue_current), 2)
  const revPct = Number(d.revenue_target) > 0 ? Number(d.revenue_current) / Number(d.revenue_target) * 100 : 0
  const revPctEl = document.getElementById('dbRevenuePct')
  if (revPctEl) revPctEl.textContent = revPct.toFixed(2) + '%'
  const revTgtLbl = document.getElementById('dbRevenueTargetLbl')
  if (revTgtLbl) revTgtLbl.textContent = dbShort(Number(d.revenue_target))
  dbSetGauge('dbGaugeRevenue', Number(d.revenue_current), Number(d.revenue_target))

  dbCountUp('dbProjectedRevenue',   Number(d.projected_revenue),  2)
  dbCountUp('dbOperatingCost',      Number(d.operating_cost),     2)
  dbCountUp('dbExternalCustomers',  Number(d.external_customers), 0)
  dbCountUp('dbPeaCustomers',       Number(d.pea_customers),      0)
  dbCountUp('dbTotalCustomers',     Number(d.total_customers),    0)

  const custPct = Number(d.total_customers_target) > 0
    ? Number(d.total_customers) / Number(d.total_customers_target) * 100 : 0
  const custPctEl = document.getElementById('dbTotalCustomersPct')
  if (custPctEl) custPctEl.textContent = custPct.toFixed(2) + '%'
  const custTgtLbl = document.getElementById('dbCustomerTargetLbl')
  if (custTgtLbl) custTgtLbl.textContent = dbShort(Number(d.total_customers_target))
  dbSetGauge('dbGaugeCustomers', Number(d.total_customers), Number(d.total_customers_target))

  function setTarget(gaugeId: string, valId: string, goalId: string, pctId: string, revenue: number, target: number) {
    dbCountUp(valId, revenue, 2)
    const goalEl = document.getElementById(goalId)
    if (goalEl) goalEl.textContent = 'เป้าหมาย ' + dbShort(target)
    const pct = target > 0 ? revenue / target * 100 : 0
    const pctEl = document.getElementById(pctId)
    if (pctEl) pctEl.textContent = pct.toFixed(2) + '%'
    dbSetGauge(gaugeId, revenue, target)
  }

  setTarget('dbGaugePeaIn',     'dbPeaIn',     'dbPeaInGoal',     'dbPeaInPct',     Number(d.pea_internal_revenue),    Number(d.pea_internal_target))
  setTarget('dbGaugePeaOut',    'dbPeaOut',    'dbPeaOutGoal',    'dbPeaOutPct',    Number(d.pea_external_revenue),    Number(d.pea_external_target))
  setTarget('dbGaugeCarbonOut', 'dbCarbonOut', 'dbCarbonOutGoal', 'dbCarbonOutPct', Number(d.carbon_external_revenue), Number(d.carbon_external_target))
  setTarget('dbGaugeCarbonIn',  'dbCarbonIn',  'dbCarbonInGoal',  'dbCarbonInPct',  Number(d.carbon_internal_revenue), Number(d.carbon_internal_target))

  const pl = Number(d.revenue_current) - Number(d.operating_cost)
  const plEl = document.getElementById('dbProfitLoss')
  dbCountUp('dbProfitLoss', Math.abs(pl), 2)
  setTimeout(() => {
    if (plEl) plEl.classList.toggle('profit', pl >= 0)
  }, 1450)
  dbCountUp('dbTotalCost',    Number(d.operating_cost),  2)
  dbCountUp('dbTotalRevenue', Number(d.revenue_current), 2)

  const totalCost = Number(d.cost_other_ops) + Number(d.cost_actual_ops) + Number(d.cost_depreciation) +
                    Number(d.cost_employee_benefits) + Number(d.cost_personnel)
  const rows = [
    { n: '2.', label: 'ค่าใช้จ่ายอื่นๆในการดำเนินงาน',      val: Number(d.cost_other_ops) },
    { n: '3.', label: 'ค่าใช้จ่ายในการดำเนินการจริง',        val: Number(d.cost_actual_ops) },
    { n: '4.', label: 'ค่าเสื่อมราคา และค่าตัดจำหน่าย',     val: Number(d.cost_depreciation) },
    { n: '5.', label: 'ค่าใช้จ่ายผลประโยชน์พนักงาน',        val: Number(d.cost_employee_benefits) },
    { n: '6.', label: 'ค่าใช้จ่ายเกี่ยวกับบุคลากร',         val: Number(d.cost_personnel) },
  ]
  const costRowsEl = document.getElementById('dbCostRows')
  if (costRowsEl) {
    costRowsEl.innerHTML = rows.map(r => {
      const barPct = totalCost > 0 ? Math.min(r.val / totalCost * 100, 100) : 0
      return `
        <div class="db-cost-row">
          <span class="db-cost-num">${r.n}</span>
          <div style="flex:1">
            <span class="db-cost-row-lbl">${r.label}</span>
            <div class="db-cost-bar-wrap">
              <div class="db-cost-bar" style="width:${barPct.toFixed(1)}%"></div>
            </div>
          </div>
          <span class="db-cost-row-val" style="margin-left:16px">${dbFmt(r.val)}</span>
        </div>`
    }).join('')
  }
}

// label คงที่เสมอ — dot สีบอก status การเชื่อมต่อ
function dbSetStatus(state: string) {
  const dot = document.getElementById('dbSyncDot')
  if (!dot) return
  const colors: Record<string, string> = {
    live:    '#10b981', // เขียว = เชื่อมต่อสำเร็จ
    loading: '#f59e0b', // เหลือง = กำลังโหลด
    error:   '#f43f5e', // แดง   = error
    demo:    '#8b5cf6', // ม่วง  = ใช้ค่า demo
  }
  dot.style.background = colors[state] || '#8b5cf6'
}

async function dbFetch() {
  try {
    dbSetStatus('loading')
    const url = SHEETS_CSV_URL + '&nocache=' + Date.now()
    const res = await fetch(url)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const csv = await res.text()
    const data = parseCSV(csv)
    if (Object.keys(data).length === 0) throw new Error('Sheet ว่างอยู่')
    dbRender(data)
    dbSetStatus('live')
    const upd = document.getElementById('dbLastUpdate')
    if (upd) upd.textContent = 'อัพเดทล่าสุด: ' + new Date().toLocaleTimeString('th-TH')
    const notice = document.getElementById('dbSetupNotice')
    if (notice) (notice as HTMLElement).style.display = 'none'
  } catch (err) {
    console.warn('[Dashboard] Google Sheets fetch failed:', err)
    dbSetStatus('error')
    dbRender(DB_DEFAULT)
  }
}

export default function Dashboard() {
  const dbInitedRef = useRef(false)

  useEffect(() => {
    // Scroll reveal observer
    const revealEls = document.querySelectorAll('#dashboard .db-reveal')
    const dbObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis')
          if (!dbInitedRef.current && e.target.closest('#dashboard')) {
            dbInitedRef.current = true
            dbFetch()
          }
        }
      })
    }, { threshold: 0.08 })

    revealEls.forEach(el => dbObserver.observe(el))

    // Refresh button
    const dbRefBtn = document.getElementById('dbRefreshBtn')
    const handleRefresh = function (this: HTMLElement) {
      const icon = this.querySelector('span')
      if (icon) {
        icon.style.animation = 'none'
        void (icon as HTMLElement).offsetWidth
        icon.style.animation = 'dbSpin 0.6s linear'
      }
      dbFetch()
    }
    if (dbRefBtn) dbRefBtn.addEventListener('click', handleRefresh as EventListener)

    // Auto poll
    const pollInterval = POLL_MS > 0 ? setInterval(dbFetch, POLL_MS) : null

    return () => {
      dbObserver.disconnect()
      if (dbRefBtn) dbRefBtn.removeEventListener('click', handleRefresh as EventListener)
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [])

  return (
    <section className="db-section" id="dashboard">
      {/* SVG gradient defs */}
      <svg width="0" height="0" style={{position:'absolute',overflow:'hidden'}} aria-hidden="true">
        <defs>
          <linearGradient id="dbGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1"/>
            <stop offset="100%" stopColor="#38bdf8"/>
          </linearGradient>
          <linearGradient id="dbGradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669"/>
            <stop offset="100%" stopColor="#34d399"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="db-container">

        {/* Header */}
        <div className="db-header db-reveal">
          <div>
            <div className="db-eyebrow">Thai Skill Report · ปี 2569 (1)</div>
            <h2 className="db-title">รายงานผู้บริหาร</h2>
          </div>
          <div className="db-header-right">
            <div className="db-sync-wrap">
              <div className="db-sync-dot" id="dbSyncDot"></div>
              <span className="db-sync-label" id="dbSyncLabel">สชก.(บก-ท)</span>
            </div>
            <div className="db-last-update" id="dbLastUpdate">อัพเดทล่าสุด: —</div>
            <button className="db-refresh-btn" id="dbRefreshBtn"><span>↻</span> รีเฟรช</button>
          </div>
        </div>

        {/* Row 1: Overview */}
        <div className="db-overview-row">

          {/* Revenue gauge (large) */}
          <div className="db-card db-card-revenue db-reveal d1">
            <div className="db-card-top-shine"></div>
            <div className="db-card-label">รายได้จากการดำเนินการ (ณ ปัจจุบัน)</div>
            <div className="db-gauge-wrap">
              <svg className="db-gauge-svg" viewBox="0 0 200 120" fill="none">
                <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                <path className="db-gauge-fill" id="dbGaugeRevenue"
                      d="M 20 105 A 80 80 0 0 1 180 105"
                      stroke="url(#dbGradBlue)"/>
              </svg>
              <div className="db-gauge-center" style={{bottom:'20px'}}>
                <div className="db-gauge-val lg" id="dbRevenueCurrent">0</div>
                <div className="db-gauge-pct" id="dbRevenuePct">0%</div>
              </div>
              <div className="db-gauge-labels">
                <span>0</span>
                <span id="dbRevenueTargetLbl">50M</span>
              </div>
            </div>
          </div>

          {/* 2×2 summary stats */}
          <div className="db-summary-grid">
            <div className="db-stat-card db-reveal d2">
              <div className="db-stat-label">รายได้คาดการณ์หลังดำเนินการตามแผน (ปัจจุบัน)</div>
              <div className="db-stat-val" id="dbProjectedRevenue">0</div>
            </div>
            <div className="db-stat-card db-reveal d2">
              <div className="db-stat-label">ค่าใช้จ่ายในการดำเนินการจริง</div>
              <div className="db-stat-val" id="dbOperatingCost">0</div>
            </div>
            <div className="db-stat-card db-stat-two db-reveal d3">
              <div className="db-stat-two-col">
                <div className="db-stat-label">จำนวนลูกค้าภายนอก</div>
                <div className="db-stat-val sm" id="dbExternalCustomers">0</div>
              </div>
              <div className="db-stat-two-col">
                <div className="db-stat-label">จำนวนลูกค้า PEA Academy</div>
                <div className="db-stat-val sm" id="dbPeaCustomers">0</div>
              </div>
            </div>
            <div className="db-stat-card db-reveal d3" style={{padding:'20px 22px'}}>
              <div className="db-customers-label">จำนวนลูกค้าทั้งหมด</div>
              <div className="db-gauge-wrap">
                <svg className="db-gauge-svg" viewBox="0 0 200 120" fill="none">
                  <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                  <path className="db-gauge-fill green" id="dbGaugeCustomers"
                        d="M 20 105 A 80 80 0 0 1 180 105"
                        stroke="url(#dbGradGreen)"/>
                </svg>
                <div className="db-gauge-center" style={{bottom:'12px'}}>
                  <div className="db-gauge-val" id="dbTotalCustomers">0</div>
                  <div className="db-gauge-pct green" id="dbTotalCustomersPct">0%</div>
                </div>
                <div className="db-gauge-labels">
                  <span>0</span>
                  <span id="dbCustomerTargetLbl">10K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Revenue vs Target */}
        <div className="db-target-row db-reveal d2">
          <div className="db-section-pill">รายได้เทียบกับเป้าหมาย</div>
          <div className="db-target-grid">

            {/* PEA ภายใน */}
            <div className="db-target-card">
              <svg viewBox="0 0 200 120" fill="none" style={{width:'100%'}}>
                <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                <path className="db-gauge-fill" id="dbGaugePeaIn"
                      d="M 20 105 A 80 80 0 0 1 180 105" stroke="url(#dbGradBlue)"/>
              </svg>
              <div className="db-target-val"  id="dbPeaIn">0</div>
              <div className="db-target-goal" id="dbPeaInGoal">เป้าหมาย 40M</div>
              <div className="db-target-pct"  id="dbPeaInPct">0%</div>
              <div className="db-target-name">PEA Academy ภายใน</div>
            </div>

            {/* PEA ภายนอก */}
            <div className="db-target-card">
              <svg viewBox="0 0 200 120" fill="none" style={{width:'100%'}}>
                <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                <path className="db-gauge-fill" id="dbGaugePeaOut"
                      d="M 20 105 A 80 80 0 0 1 180 105" stroke="url(#dbGradBlue)"/>
              </svg>
              <div className="db-target-val"  id="dbPeaOut">0</div>
              <div className="db-target-goal" id="dbPeaOutGoal">เป้าหมาย 6M</div>
              <div className="db-target-pct"  id="dbPeaOutPct">0%</div>
              <div className="db-target-name">PEA Academy ภายนอก</div>
            </div>

            {/* Carbon ภายนอก */}
            <div className="db-target-card">
              <svg viewBox="0 0 200 120" fill="none" style={{width:'100%'}}>
                <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                <path className="db-gauge-fill" id="dbGaugeCarbonOut"
                      d="M 20 105 A 80 80 0 0 1 180 105" stroke="url(#dbGradBlue)"/>
              </svg>
              <div className="db-target-val"  id="dbCarbonOut">0</div>
              <div className="db-target-goal" id="dbCarbonOutGoal">เป้าหมาย 2M</div>
              <div className="db-target-pct"  id="dbCarbonOutPct">0%</div>
              <div className="db-target-name">Carbon Form ภายนอก</div>
            </div>

            {/* Carbon ภายใน */}
            <div className="db-target-card">
              <svg viewBox="0 0 200 120" fill="none" style={{width:'100%'}}>
                <path className="db-gauge-track" d="M 20 105 A 80 80 0 0 1 180 105"/>
                <path className="db-gauge-fill" id="dbGaugeCarbonIn"
                      d="M 20 105 A 80 80 0 0 1 180 105" stroke="url(#dbGradBlue)"/>
              </svg>
              <div className="db-target-val"  id="dbCarbonIn">0</div>
              <div className="db-target-goal" id="dbCarbonInGoal">เป้าหมาย 2M</div>
              <div className="db-target-pct"  id="dbCarbonInPct">0%</div>
              <div className="db-target-name">Carbon Form ภายใน</div>
            </div>
          </div>
        </div>

        {/* Row 3: P&L + Cost Table */}
        <div className="db-bottom-row">

          {/* P&L */}
          <div className="db-pl-card db-reveal d3">
            <div className="db-pl-pill">ต้นทุนและงบกำไรขาดทุน</div>
            <div className="db-pl-layout">
              <div className="db-pl-left">
                <div className="db-pl-main-lbl">กำไร (ขาดทุน)</div>
                <div className="db-pl-main-val" id="dbProfitLoss">0</div>
              </div>
              <div className="db-pl-right">
                <div>
                  <div className="db-pl-sub-lbl">ต้นทุน</div>
                  <div className="db-pl-sub-val" id="dbTotalCost">0</div>
                </div>
                <div>
                  <div className="db-pl-sub-lbl">รายได้</div>
                  <div className="db-pl-sub-val" id="dbTotalRevenue">0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost table */}
          <div className="db-cost-card db-reveal d4">
            <div className="db-cost-pill">รายการค่าใช้จ่ายต้นทุน</div>
            <div className="db-cost-thead">
              <span>รายการ</span>
              <span>จำนวนเงิน (บาท)</span>
            </div>
            <div id="dbCostRows"></div>
          </div>
        </div>

        {/* Google Sheets setup notice */}
        <div className="db-setup-notice" id="dbSetupNotice">
          <span>⚙️ เชื่อมต่อ Google Sheets:</span>
          เปิด Google Sheet → ไฟล์ → เผยแพร่ไปยังเว็บ → เลือก CSV
          จากนั้นใส่ Sheet ID ในตัวแปร <code>SHEETS_ID</code> ในโค้ด
          (รูปแบบตาราง: คอลัมน์ A = key, คอลัมน์ B = value)
        </div>

      </div>
    </section>
  )
}
