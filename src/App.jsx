import { usePremiumMotion } from './hooks/usePremiumMotion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
  usePremiumMotion()
  return (
    <>
      <Navbar />
      <MusicPlayer />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  )
}
