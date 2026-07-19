import { strengths } from '../data/content'
import GlowCard from './GlowCard'
import Icon from './Icon'
import './Strengths.css'

export default function Strengths() {
  return (
    <section id="strengths" className="section strengths" data-motion-section>
      <div className="container">
        <div className="section-display strengths__display" aria-hidden="true">
          STRENGTHS
        </div>
        <header className="strengths__head motion-head">
          <span className="eyebrow motion-copy">个人优势</span>
          <h2 className="section-title motion-copy">
            一个人，就是一支<span className="grad-text">创作团队</span>
          </h2>
          <p className="section-sub motion-copy">
            从选题到成片，我把策划、AI 生产、剪辑包装与现场统筹整合进同一套高效工作流。
          </p>
        </header>

        <div className="strengths__grid">
          {strengths.map((s, i) => (
            <GlowCard
              as="article"
              key={s.title}
              className="strength motion-card"
              style={{ '--delay': `${(i % 3) * 80}ms` }}
              glowColor="140, 192, 221"
              glowRadius={180}
            >
              <span className="strength__ico">
                <Icon name={s.icon} size={26} />
              </span>
              <h3 className="strength__title">{s.title}</h3>
              <p className="strength__desc">{s.desc}</p>
              <span className="strength__no">0{i + 1}</span>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
