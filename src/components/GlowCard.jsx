import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './GlowCard.css'

const MOBILE_BREAKPOINT = 768

export default function GlowCard({
  as: Tag = 'div',
  className = '',
  children,
  glowColor = '140, 192, 221',
  glowRadius = 180,
  style,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
    if (isMobile) return

    let rafId = null

    const handleMouseMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--glow-x', `${x}%`)
        el.style.setProperty('--glow-y', `${y}%`)
        el.style.setProperty('--glow-intensity', '1')
        el.style.setProperty('--glow-radius', `${glowRadius}px`)
      })
    }

    const handleMouseLeave = () => {
      el.style.setProperty('--glow-intensity', '0')
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [glowColor, glowRadius])

  return (
    <Tag
      ref={ref}
      className={`glow-card ${className}`}
      style={{ '--glow-color': glowColor, ...style }}
      {...rest}
    >
      <span className="glow-card__bg" aria-hidden="true" />
      <span className="glow-card__border" aria-hidden="true" />
      <span className="glow-card__content">{children}</span>
    </Tag>
  )
}
