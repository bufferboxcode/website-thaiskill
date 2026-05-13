'use client'

import { useEffect } from 'react'

const tickerData = [
  { name: 'สาขา กรุงเทพ',  val: '฿12,430,200', chg: '+3.2%',  up: true },
  { name: 'สาขา เชียงใหม่', val: '฿8,204,750',  chg: '+1.8%',  up: true },
  { name: 'สาขา ภูเก็ต',   val: '฿5,980,100',  chg: '-0.4%',  up: false },
  { name: 'ออนไลน์',        val: '฿18,650,400', chg: '+7.1%',  up: true },
  { name: 'สาขา ขอนแก่น',  val: '฿3,055,300',  chg: '+0.9%',  up: true },
  { name: 'B2B Channel',    val: '฿9,200,000',  chg: '+2.5%',  up: true },
  { name: 'สาขา พัทยา',    val: '฿4,100,500',  chg: '-1.1%',  up: false },
]

function buildTicker(items: typeof tickerData) {
  return items.map(d =>
    `<span class="ticker-item">` +
    `<span>${d.name}</span>` +
    `<span class="tick-val">${d.val}</span>` +
    `<span class="${d.up ? 'tick-up' : 'tick-down'}">${d.chg}</span>` +
    `</span>` +
    `<span class="ticker-sep"></span>`
  ).join('')
}

export default function Ticker() {
  useEffect(() => {
    const tickerEl = document.getElementById('ticker')
    if (tickerEl) {
      tickerEl.innerHTML = buildTicker(tickerData) + buildTicker(tickerData)
    }
  }, [])

  return (
    <div className="ticker-wrap">
      <div className="ticker-inner" id="ticker"></div>
    </div>
  )
}
