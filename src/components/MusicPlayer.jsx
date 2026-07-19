import { useRef, useState, useEffect, useCallback } from 'react'
import './MusicPlayer.css'

const TARGET_VOL = 0.1
const FADE_MS = 500

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const dragRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [pos, setPos] = useState(() => ({
    x: 20,
    y: window.innerHeight / 2 - 35,
  }))

  useEffect(() => {
    const audio = new Audio('/bgm.mp3')
    audio.loop = true
    audio.volume = 0
    audio.preload = 'auto'
    audioRef.current = audio

    const onCanPlay = () => setReady(true)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('canplaythrough', onCanPlay)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('ended', onEnded)
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const fade = useCallback((from, to, onDone) => {
    const audio = audioRef.current
    if (!audio) { onDone?.(); return }
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / FADE_MS, 1)
      audio.volume = from + (to - from) * t
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step)
      } else {
        fadeRef.current = null
        onDone?.()
      }
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  const toggle = useCallback((e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null

    if (playing) {
      fade(audio.volume, 0, () => {
        audio.pause()
        setPlaying(false)
      })
    } else {
      audio.volume = 0
      audio.play().then(() => {
        setPlaying(true)
        fade(0, TARGET_VOL)
      }).catch(() => {})
    }
  }, [playing, fade])

  // 拖动 — 仅从非交互区域拖拽（Mouse 事件，避免 Pointer Capture 干扰点击）
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    // 点击按钮或唱片时不启动拖动
    if (e.target.closest('.mini-player__btn') || e.target.closest('.mini-player__art')) return
    dragging.current = true
    const rect = dragRef.current.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    e.preventDefault()
  }, [])

  useEffect(() => {
    const el = dragRef.current
    if (!el) return

    const onMove = (e) => {
      if (!dragging.current) return
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      })
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    // 触屏支持
    const elTouch = el
    const onTouchStart = (e) => {
      if (e.target.closest('.mini-player__btn') || e.target.closest('.mini-player__art')) return
      dragging.current = true
      const touch = e.touches[0]
      const rect = elTouch.getBoundingClientRect()
      offset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }
    const onTouchMove = (e) => {
      if (!dragging.current) return
      const touch = e.touches[0]
      setPos({
        x: touch.clientX - offset.current.x,
        y: touch.clientY - offset.current.y,
      })
    }
    const onTouchEnd = () => { dragging.current = false }

    elTouch.addEventListener('touchstart', onTouchStart, { passive: true })
    elTouch.addEventListener('touchmove', onTouchMove, { passive: true })
    elTouch.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      elTouch.removeEventListener('touchstart', onTouchStart)
      elTouch.removeEventListener('touchmove', onTouchMove)
      elTouch.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <div
      ref={dragRef}
      className={`mini-player ${playing ? 'is-playing' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
      role="group"
      aria-label="音乐播放器"
    >
      {/* 唱片封面 */}
      <div className="mini-player__art" onClick={toggle}>
        <div className="mini-player__disc">
          <img src="/bgm-cover.jpg" alt="Flower Dance" className="mini-player__cover" />
          <div className="mini-player__disc-hole" />
        </div>
      </div>

      {/* 歌曲信息 */}
      <div className="mini-player__info">
        <div className="mini-player__title">《Flower Dance》</div>
        <div className="mini-player__sub">背景音乐</div>
      </div>

      {/* 控制按钮 */}
      <div className="mini-player__controls">
        <button
          className="mini-player__btn"
          onClick={toggle}
          disabled={!ready}
          aria-label={playing ? '暂停' : '播放'}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="4" height="10" rx="1" fill="currentColor" />
              <rect x="10" y="3" width="4" height="10" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L13 8L5 13V3Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* 播放中音频条 */}
      {playing && (
        <span className="mini-player__bars" aria-hidden="true">
          <span /><span /><span />
        </span>
      )}
    </div>
  )
}
