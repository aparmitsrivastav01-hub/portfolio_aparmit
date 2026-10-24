import { MascotPlaceholder } from './MascotPlaceholder'
import { MobileMenu, type MobileNavigationItem } from './MobileMenu'
import { About } from './About'
import { Journey } from './Journey'
import { Projects } from './Projects'
import { Contact } from './Contact'

const navigationItems: MobileNavigationItem[] = [
  { label: '01. Home', href: '#top' },
  { label: '02. About', href: '#about' },
  { label: '03. Journey', href: '#journey' },
  { label: '04. Project', href: '#project' },
  { label: '05. Contact', href: '#contact' },
]

const explorationNotes = ['curious', 'always exploring', 'new ideas...']
const opportunityNotes = ['Projects', 'Ideas', 'Opportunities']

export function Hero() {
  return (
    <>
      <header id="top" className="hero-header">
        <a className="hero-brand" href="#top" aria-label="Aparmit Srivastav, home">
          <span>APARMIT SRIVASTAV</span>
          <span className="hero-brand-indicator" aria-hidden="true">●</span>
        </a>

        <nav className="hero-navigation" aria-label="Main navigation">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hero-header-actions">
          <button type="button" aria-label="Theme toggle placeholder" disabled>
            Theme
          </button>
          <a href="#contact">Let's Talk ↗</a>
          <MobileMenu items={navigationItems} />
        </div>
      </header>

      <main id="hero-content" className="hero-main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-metadata">
              <span>( LUCKNOW, INDIA )</span>
              <span aria-hidden="true">|</span>
              <span>18 Y/O</span>
            </p>

            <h1 id="hero-title" className="hero-title">
              <span>I build</span>
              <span>things that</span>
              <span><em>think.</em></span>
            </h1>

            <p id="hero-description" className="hero-description">
              Exploring AI systems, full-stack development and real-world products at the intersection of technology, finance and everyday problems.
            </p>

            <a className="hero-primary-cta" href="#work">
              <span className="hero-primary-cta-arrow" aria-hidden="true">↗</span>
              <span>EXPLORE MY WORK</span>
            </a>
          </div>

          <MascotPlaceholder />

          <aside className="hero-exploration-notes" aria-label="Personal notes">
            {explorationNotes.map((note) => <p key={note}>{note}</p>)}
          </aside>

          <aside className="hero-opportunity-notes" aria-label="Ideas and opportunities">
            <ul>
              {opportunityNotes.map((note) => <li key={note}>{note}</li>)}
              <li><a href="#contact">Let's talk!</a></li>
            </ul>
          </aside>

          <a className="hero-scroll-indicator" href="#hero-description" aria-label="Scroll to the introduction">
            SCROLL
          </a>
        </section>
        <About />
        <Journey />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default Hero
