import { useEffect, useMemo, useState } from 'react'
import Dock from './Dock'
import Weather from './Weather'
import { nav, profile } from '../data/content'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    let rafId
    let last = false
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const now = window.scrollY > 40
        if (now !== last) {
          last = now
          setScrolled(now)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const dockItems = useMemo(
    () =>
      nav
        .filter((item) => item.id !== 'contact')
        .map((item) => ({
          href: `#${item.id}`,
          label: item.label,
          active: active === item.id,
        })),
    [active]
  )

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    nav.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#hero" className="nav__logo">
          <span className="nav__logo-mark">
            <img src="/logo.png" alt="" className="nav__logo-img" />
          </span>
          <span className="nav__logo-text">
            {profile.penName}
            <em>{profile.role}</em>
          </span>
        </a>

        <nav className="nav__links">
          <Dock
            items={dockItems}
            panelHeight={56}
            baseItemSize={56}
            magnification={74}
            distance={180}
            dockHeight={116}
          />
        </nav>

        <Weather />

        <a href="#contact" className="btn btn-primary nav__cta">
          联系我
        </a>
      </div>
    </header>
  )
}
