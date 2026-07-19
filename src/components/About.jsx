import { profile, stats } from '../data/content'
import DotField from './DotField'
import GlowCard from './GlowCard'
import Icon from './Icon'
import './About.css'

const contacts = [
  {
    iconImage: '/social-icons/bilibili.webp',
    label: '哔哩哔哩',
    value: 'Bilibili 主页',
    href: 'https://space.bilibili.com/3763724',
    external: true,
  },
  {
    iconImage: '/social-icons/douyin.webp',
    label: '抖音',
    value: '抖音主页',
    href: 'https://v.douyin.com/Ajyc3yb9yf0/',
    external: true,
  },
  { icon: 'pin', label: '所在地', value: profile.location, copyable: false },
]

export default function About() {
  return (
    <section id="about" className="section about" data-motion-section>
      <div className="about__bg" aria-hidden="true">
        <DotField
          dotRadius={3.4}
          dotSpacing={13}
          bulgeStrength={32}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={1.2}
          cursorRadius={760}
          cursorForce={0.4}
          gradientFrom="rgba(63, 134, 191, 0.55)"
          gradientTo="rgba(140, 192, 221, 0.34)"
          glowColor="transparent"
        />
      </div>
      <div className="about__overlay" aria-hidden="true" />
      <div className="container about__grid">
        <div className="section-display about__display" aria-hidden="true">
          ABOUT
        </div>
        {/* Portrait */}
        <div className="about__portrait motion-card motion-media motion-parallax">
          <div className="about__photo">
            {/* Replace with a real photo at public/portrait.jpg */}
            <img
              src="/portrait.jpg"
              alt={`${profile.penName} 头像`}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="about__photo-fallback">{profile.penName[0]}</span>
            <div className="about__photo-ring" />
          </div>
          <div className="about__namecard">
            <div className="about__name">
              {profile.realName}
            </div>
            <div className="about__role">
              {profile.role} · {profile.roleEn}
            </div>
          </div>
        </div>

        {/* Bio + contacts */}
        <div className="about__body">
          <div className="motion-head">
            <span className="eyebrow motion-copy">关于我</span>
            <h2 className="section-title motion-copy">
              热点嗅觉 + AI 工作流，
              <br />
              让<span className="grad-text">创意</span>真正落地为画面
            </h2>
            <p className="about__bio motion-copy">{profile.intro}</p>
          </div>

          <div className="about__contacts">
            {contacts.map((c) => {
              const Inner = (
                <>
                  <span className="about__contact-ico">
                    {c.iconImage ? (
                      <img src={c.iconImage} alt={c.label} className="about__contact-platform-icon" />
                    ) : (
                      <Icon name={c.icon} size={20} />
                    )}
                  </span>
                  <span className="about__contact-meta">
                    <em>{c.label}</em>
                    <strong>{c.value}</strong>
                  </span>
                </>
              )
              return c.external ? (
                <GlowCard
                  key={c.label}
                  as="a"
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="about__contact about__contact--platform motion-card"
                  glowColor="140, 192, 221"
                  glowRadius={170}
                >
                  {Inner}
                  <span className="about__platform-hint">前往主页</span>
                </GlowCard>
              ) : (
                <GlowCard
                  key={c.label}
                  className="about__contact motion-card"
                  glowColor="140, 192, 221"
                  glowRadius={170}
                >
                  {Inner}
                </GlowCard>
              )
            })}
          </div>

          <div className="about__stats">
            {stats.map((s) => (
              <GlowCard
                key={s.label}
                className="about__stat motion-card"
                glowColor="140, 192, 221"
                glowRadius={170}
              >
                <div className="about__stat-num">
                  {s.value}
                  <em>{s.suffix}</em>
                </div>
                <div className="about__stat-label">{s.label}</div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
