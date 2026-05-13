'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function Nav() {
  const navWrapperRef = useRef<HTMLDivElement>(null)
  const navPillRef = useRef<HTMLElement>(null)
  const navIndicatorRef = useRef<HTMLDivElement>(null)
  const themeBtnRef = useRef<HTMLButtonElement>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const navWrapper = navWrapperRef.current
    const navPill = navPillRef.current
    const navIndicator = navIndicatorRef.current
    const themeBtn = themeBtnRef.current
    if (!navWrapper || !navPill || !navIndicator || !themeBtn) return

    const navItems = navPill.querySelectorAll<HTMLElement>('.nav-item')
    const sections = ['hero', 'about', 'services', 'team']

    function moveIndicator(el: HTMLElement) {
      const pillRect = navPill!.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      navIndicator!.style.left = (elRect.left - pillRect.left - 6) + 'px'
      navIndicator!.style.width = elRect.width + 'px'
    }

    function setActive(el: HTMLElement) {
      navItems.forEach(i => i.classList.remove('active'))
      el.classList.add('active')
      moveIndicator(el)
    }

    // Init indicator on first active item
    const firstActive = navPill.querySelector<HTMLElement>('.nav-item.active')
    if (firstActive) moveIndicator(firstActive)

    // Click nav items
    const clickHandlers: Array<() => void> = []
    navItems.forEach(item => {
      const clickHandler = () => {
        setActive(item)
        const sectionId = item.dataset.section
        if (sectionId) {
          const target = document.getElementById(sectionId)
          if (target) target.scrollIntoView({ behavior: 'smooth' })
        }
      }
      const mouseEnterHandler = () => {
        moveIndicator(item)
        navIndicator!.style.opacity = '1'
      }
      const mouseLeaveHandler = () => {
        navIndicator!.style.opacity = '0'
      }
      item.addEventListener('click', clickHandler)
      item.addEventListener('mouseenter', mouseEnterHandler)
      item.addEventListener('mouseleave', mouseLeaveHandler)
      clickHandlers.push(() => {
        item.removeEventListener('click', clickHandler)
        item.removeEventListener('mouseenter', mouseEnterHandler)
        item.removeEventListener('mouseleave', mouseLeaveHandler)
      })
    })

    // Hide/show nav on scroll
    let lastScrollY = 0
    let scrollTimer: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      const sy = window.scrollY
      if (sy > 120 && sy > lastScrollY) {
        navWrapper!.classList.add('hidden')
      } else {
        navWrapper!.classList.remove('hidden')
      }
      lastScrollY = sy

      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        let current = 0
        sections.forEach((id, i) => {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= 120) current = i
        })
        const targetItem = navPill!.querySelector<HTMLElement>(`.nav-item[data-section="${sections[current]}"]`)
        if (targetItem) setActive(targetItem)
      }, 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
      clickHandlers.forEach(fn => fn())
    }
  }, [])

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement
    const themeBtn = themeBtnRef.current
    if (!themeBtn) return

    if (darkMode) {
      root.style.setProperty('--bg', '#080808')
      root.style.setProperty('--surface', '#111111')
      root.style.setProperty('--border', 'rgba(255,255,255,0.07)')
      root.style.setProperty('--text-primary', '#f0f0f0')
      root.style.setProperty('--text-secondary', '#888')
      root.style.setProperty('--text-muted', '#444')
      themeBtn.style.borderColor = '#818cf8'
    } else {
      root.style.setProperty('--bg', '#ffffff')
      root.style.setProperty('--surface', '#f4f6f9')
      root.style.setProperty('--border', 'rgba(0,0,0,0.09)')
      root.style.setProperty('--text-primary', '#0d1f4e')
      root.style.setProperty('--text-secondary', '#4a5568')
      root.style.setProperty('--text-muted', '#9aa3b2')
      themeBtn.style.borderColor = 'var(--accent)'
    }
  }, [darkMode])

  const sunIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )

  const moonIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )

  const scrollToTeam = () => {
    const el = document.getElementById('team')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="nav-wrapper" id="navWrapper" ref={navWrapperRef}>
        <nav className="nav-pill" id="navPill" ref={navPillRef}>
          <div className="nav-pill-indicator" id="navIndicator" ref={navIndicatorRef}></div>

          <a className="nav-logo-inside" href="#hero">
            <Image src="/thaiskill-logo.svg" alt="Thai Skill" width={120} height={26} />
          </a>

          <div className="nav-divider"></div>

          <a className="nav-item" href="#about" data-section="about">เกี่ยวกับเรา</a>
          <a className="nav-item" href="#services" data-section="services">บริการของเรา</a>
          <a className="nav-item" href="#team" data-section="team">ทีมของเรา</a>

          <div className="nav-divider"></div>

          <button
            className="nav-theme-btn"
            id="themeBtn"
            ref={themeBtnRef}
            title="เปลี่ยนธีม"
            onClick={() => setDarkMode(d => !d)}
          >
            {darkMode ? moonIcon : sunIcon}
          </button>

          <button className="nav-cta-pill" onClick={scrollToTeam}>
            ติดต่อเรา
          </button>
        </nav>
      </div>

      <div className="nav-scroll-dot" id="scrollDots">
        <div className="scroll-dot active" data-dot="0"></div>
        <div className="scroll-dot" data-dot="1"></div>
        <div className="scroll-dot" data-dot="2"></div>
        <div className="scroll-dot" data-dot="3"></div>
      </div>
    </>
  )
}
