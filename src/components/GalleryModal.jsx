import { useState, useCallback, useEffect, useRef } from 'react'
import './GalleryModal.css'

function GalleryImg({ url, alt, shouldLoad }) {
  const [state, setState] = useState('idle')

  useEffect(() => {
    if (!shouldLoad || state !== 'idle') return
    setState('loading')
  }, [shouldLoad, state])

  const handleLoad = (e) => {
    e.currentTarget.decode().then(() => setState('done')).catch(() => setState('done'))
  }

  return (
    <div className="gallery-img-wrap">
      {state !== 'idle' && (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={(e) => {
            e.currentTarget.alt = '加载失败'
            e.currentTarget.style.opacity = '0.4'
          }}
          className={state === 'done' ? 'gallery-img--loaded' : ''}
        />
      )}
      <div className={`gallery-img-ph ${state !== 'idle' ? 'gallery-img-ph--hidden' : ''}`} aria-hidden="true" />
    </div>
  )
}

export default function GalleryModal({ images, title, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [visibleSet, setVisibleSet] = useState(() => new Set())
  const gridRef = useRef(null)
  const itemRefs = useRef([])
  const observerRef = useRef(null)
  const rafIdRef = useRef(null)

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goPrev = () => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  const goNext = () => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))

  // Shared IntersectionObserver — batched with rAF
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // Batch state updates: collect all intersecting entries, flush once per frame
    let pending = []

    const flush = () => {
      rafIdRef.current = null
      if (!pending.length) return
      const indices = pending
      pending = []
      setVisibleSet((prev) => {
        const next = new Set(prev)
        for (const idx of indices) next.add(idx)
        return next
      })
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            pending.push(Number(entry.target.dataset.galleryIdx))
          }
        }
        if (pending.length && !rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(flush)
        }
      },
      { root: grid, rootMargin: '120px' }
    )
    observerRef.current = obs

    // Stagger observations — max 6 per frame to avoid layout thrash
    const items = itemRefs.current.filter(Boolean)
    let i = 0
    const observeBatch = () => {
      const end = Math.min(i + 6, items.length)
      for (; i < end; i++) obs.observe(items[i])
      if (i < items.length) requestAnimationFrame(observeBatch)
    }
    requestAnimationFrame(observeBatch)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      obs.disconnect()
    }
  }, [images.length])

  // Observe new item refs
  const setItemRef = useCallback((el, i) => {
    itemRefs.current[i] = el
    if (el && observerRef.current) {
      observerRef.current.observe(el)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox()
        else onClose()
      }
      if (lightboxIndex !== null && e.key === 'ArrowLeft') goPrev()
      if (lightboxIndex !== null && e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, closeLightbox, lightboxIndex])

  return (
    <div className="gallery-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button type="button" className="gallery-close" aria-label="关闭图库" onClick={onClose}>
        <span aria-hidden="true">×</span>
      </button>

      <div className="gallery-header">
        <h3 className="gallery-title">{title}</h3>
        <span className="gallery-count">{images.length} 张照片</span>
      </div>

      <div ref={gridRef} className="gallery-grid" onClick={(e) => e.stopPropagation()}>
        {images.map((url, i) => (
          <button
            key={i}
            ref={(el) => setItemRef(el, i)}
            type="button"
            className="gallery-item"
            data-gallery-idx={i}
            onClick={() => openLightbox(i)}
            aria-label={`查看照片 ${i + 1}`}
          >
            <GalleryImg url={url} alt={`摄影作品 ${i + 1}`} shouldLoad={visibleSet.has(i)} />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="gallery-lightbox" onClick={(e) => { e.stopPropagation(); closeLightbox(); }}>
          <button type="button" className="gallery-lb-close" aria-label="关闭" onClick={closeLightbox}>
            <span aria-hidden="true">×</span>
          </button>
          <button type="button" className="gallery-lb-nav gallery-lb-prev" aria-label="上一张" onClick={(e) => { e.stopPropagation(); goPrev() }}>
            ‹
          </button>
          <button type="button" className="gallery-lb-nav gallery-lb-next" aria-label="下一张" onClick={(e) => { e.stopPropagation(); goNext() }}>
            ›
          </button>
          <div className="gallery-lb-counter">{lightboxIndex + 1} / {images.length}</div>
          <img
            className="gallery-lb-image"
            src={images[lightboxIndex]}
            alt={`摄影作品 ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.alt = '加载失败'
              e.currentTarget.style.objectFit = 'contain'
            }}
          />
        </div>
      )}
    </div>
  )
}
