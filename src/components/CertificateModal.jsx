import { useEffect, useRef } from 'react'
import './CertificateModal.css'

/**
 * 单张证书 / 获奖凭证的查看弹窗。
 * 竖版长图按容器高度自适应，支持点击背景与 Esc 关闭。
 */
export default function CertificateModal({ src, title, subtitle, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="cert-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} 证书` : '证书查看'}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="cert-close"
        aria-label="关闭证书"
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="cert-inner" onClick={(e) => e.stopPropagation()}>
        <div className="cert-frame">
          <img
            className="cert-image"
            src={src}
            alt={title ? `${title} 获奖证书` : '获奖证书'}
            onError={(e) => {
              e.currentTarget.alt = '证书加载失败'
              e.currentTarget.style.opacity = '0.4'
            }}
          />
        </div>

        {(title || subtitle) && (
          <div className="cert-meta">
            {title ? <h3 className="cert-title">{title}</h3> : null}
            {subtitle ? <p className="cert-subtitle">{subtitle}</p> : null}
          </div>
        )}
      </div>
    </div>
  )
}
