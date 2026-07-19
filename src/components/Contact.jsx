import { profile } from '../data/content'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import Icon from './Icon'
import './Contact.css'

export default function Contact() {
  const year = 2026
  const { copiedValue, copy } = useCopyToClipboard()
  return (
    <section id="contact" className="contact" data-motion-section>
      <div className="contact__bg">
        <div className="contact__mesh" />
        <div className="contact__grid-lines" />
      </div>

      <div className="container contact__inner">
        <div className="section-display contact__display" aria-hidden="true">
          CONTACT
        </div>
        <div className="contact__core motion-head">
          <span className="eyebrow motion-copy">联系合作</span>
          <h2 className="contact__title motion-copy">
            有好点子？
            <br />
            <span className="grad-text">一起把它做成爆款。</span>
          </h2>
          <p className="contact__lead motion-copy">
            短视频创作、AI 视觉、商业分镜或剪辑包装 —— 欢迎随时找我聊聊。
          </p>

          <div className="contact__rows">
            <button
              type="button"
              className="contact__row contact__row--button motion-card"
              onClick={() => copy(profile.email)}
            >
              <Icon name="mail" size={18} />
              <em>邮箱</em>
              <strong>{profile.email}</strong>
              <span className={`contact__copy-tip ${copiedValue === profile.email ? 'is-visible' : ''}`}>
                已复制
              </span>
            </button>
            <button
              type="button"
              className="contact__row contact__row--button motion-card"
              onClick={() => copy(profile.phone)}
            >
              <Icon name="phone" size={18} />
              <em>电话</em>
              <strong>{profile.phone}</strong>
              <span className={`contact__copy-tip ${copiedValue === profile.phone ? 'is-visible' : ''}`}>
                已复制
              </span>
            </button>
            <div className="contact__row motion-card">
              <Icon name="pin" size={18} />
              <em>城市</em>
              <strong>{profile.location}</strong>
            </div>
            <a
              className="contact__row contact__row--platform motion-card"
              href="https://space.bilibili.com/3763724"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__row-ico">
                <img src="/social-icons/bilibili.webp" alt="哔哩哔哩" className="contact__platform-icon" />
              </span>
              <strong>Bilibili 主页</strong>
              <span className="contact__platform-hint">前往主页</span>
            </a>
            <a
              className="contact__row contact__row--platform motion-card"
              href="https://v.douyin.com/Ajyc3yb9yf0/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__row-ico">
                <img src="/social-icons/douyin.webp" alt="抖音" className="contact__platform-icon" />
              </span>
              <strong>抖音主页</strong>
              <span className="contact__platform-hint">前往主页</span>
            </a>
          </div>
        </div>

        <footer className="contact__footer motion-card">
          <div className="contact__brand">
            <span className="contact__brand-mark">
              <img src="/logo.png" alt="" className="contact__brand-img" />
            </span>
            <span>
              梁杰华
              <em>{profile.role}</em>
            </span>
          </div>
          <p className="contact__copy">
            © {year} 由 Teracined 创作，保留所有权利。
          </p>
        </footer>
      </div>
    </section>
  )
}
