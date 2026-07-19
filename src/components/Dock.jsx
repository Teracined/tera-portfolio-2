'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Children, cloneElement, useMemo, useRef } from 'react'

import './Dock.css'

function DockItem({
  children,
  className = '',
  onClick,
  href,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  active = false,
}) {
  const ref = useRef(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    }
    return val - rect.x - rect.width / 2
  })

  const targetScale = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [1, magnification / baseItemSize, 1]
  )
  const scale = useSpring(targetScale, spring)
  const y = useSpring(useTransform(scale, [1, magnification / baseItemSize], [0, -8]), spring)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
      if (href) window.location.hash = href.replace('#', '')
    }
  }

  const handleClick = () => {
    onClick?.()
    if (href) window.location.hash = href.replace('#', '')
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        scale,
        y,
        transformOrigin: 'center bottom',
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={handleClick}
      className={`dock-item ${active ? 'is-active' : ''} ${className}`}
      tabIndex={0}
      role="button"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered, active }))}
    </motion.a>
  )
}

function DockText({ children, className = '', isHovered, active }) {
  return (
    <motion.span
      className={`dock-text ${className}`}
      animate={{ y: active ? -1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.span>
  )
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 180, damping: 14 },
  magnification = 74,
  distance = 180,
  panelHeight = 56,
  dockHeight = 120,
  baseItemSize = 56,
}) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  )
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1)
          mouseX.set(pageX)
        }}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Infinity)
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Section navigation"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            href={item.href}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
            active={item.active}
          >
            <DockText>{item.label}</DockText>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  )
}
