import { LangProvider } from './i18n/LangContext'
import { useLenis } from './motion/useLenis'
import { SakuraCanvas } from './sakura/SakuraCanvas'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { FeaturedProjects } from './sections/FeaturedProjects'
import { ProjectIndex } from './sections/ProjectIndex'
import { Footer } from './sections/Footer'

export default function App() {
  useLenis()

  return (
    <LangProvider>
      <SakuraCanvas />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <FeaturedProjects />
        <ProjectIndex />
      </main>
      <Footer />
    </LangProvider>
  )
}
