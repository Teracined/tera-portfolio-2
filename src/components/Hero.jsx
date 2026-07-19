import { profile, heroFacts } from '../data/content'
import Icon from './Icon'
import './Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero" data-motion-section>
      <div className="hero__frame">
        {/* Background video — muted, sampled palette drives the whole site */}
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__veil" />

        {/* Centered headline block */}
        <div className="hero__center">
          <div className="hero__badge">
            <span className="dot" />
            {profile.school} · {profile.major}
          </div>

          <h1 className="hero__title" aria-label={profile.penName}>
            <span className="hero__title-line-wrap">
              <span className="hero__title-line">{profile.penName}</span>
            </span>
          </h1>

          <p className="hero__lead">{profile.heroLead}</p>

          <div className="hero__actions">
            <a href="#projects" className="btn btn-light">
              查看作品 <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>

        {/* Bottom facts bar (school info lives here) */}
        <div className="hero__facts">
          {heroFacts.map((f) => (
            <div key={f.label} className="hero__fact">
              <div className="hero__fact-label">{f.label}</div>
              <div className="hero__fact-value">{f.value}</div>
              <div className="hero__fact-sub">{f.sub}</div>
            </div>
          ))}
          <a href="#projects" className="hero__explore">
            探索 Explore <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="向下滚动">
        <span>下滑探索</span>
        <Icon name="down" size={20} />
      </a>
    </section>
  )
}
