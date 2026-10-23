import './About.css'
import { PhotoCarousel, type CarouselPhoto } from './PhotoCarousel'

interface AboutFact {
  label: string
  value: string
}

const aboutFacts: AboutFact[] = [
  { label: 'BASED IN', value: 'Lucknow, India' },
  { label: 'STUDYING', value: 'BS Data Science, IIT Madras' },
  { label: 'FOCUS', value: 'AI systems, full-stack' },
  { label: 'STACK', value: 'Python, FastAPI, React, TypeScript' },
]

const photos: CarouselPhoto[] = [
  {
    src: '/images/about/star-performer-award.jpg',
    alt: 'Aparmit receiving a Star Performer award at a school ceremony',
    caption: 'STAR PERFORMER · CLASS 12',
  },
  {
    src: '/images/about/mentor-selfie-source-crop.jpg',
    alt: 'Aparmit taking a selfie with Rajat Arora at an event',
    caption: 'MEETING RAJAT ARORA',
  },
  {
    src: '/images/about/late-night-building-square.jpg',
    alt: 'Aparmit at a gaming LAN event with other participants',
    caption: 'GAMING LAN EVENTS',
  },
  {
    src: '/images/about/venue-meetup.jpg',
    alt: 'Aparmit standing with Sidharth, owner of Newton School of Technology',
    caption: 'MEETING SIDHARTH — NST',
  },
  {
    src: '/images/about/certificate-moment.jpg',
    alt: 'Aparmit holding a Certificate of Excellence from the SRM hackathon',
    caption: 'SRM HACKATHON — 3RD PLACE',
  },
]

export function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-kicker">
        <p>02 — ABOUT</p>
        <span aria-hidden="true" />
      </div>

      <div className="about-layout">
        <div className="about-copy">
          <h2 id="about-title" className="about-title">
            Curious by default,<br />
            builder by <em>habit.</em>
          </h2>

          <div className="about-biography">
            <p>
              I'm a student at IIT Madras (BS in Data Science) who learns by building.
              Python/FastAPI backends, React/TypeScript frontends, AI-driven products.
            </p>
            <p>
              I like problems between technology, finance and everyday life. Placed 3rd
              at a hackathon, now looking for internships where I can keep shipping.
            </p>
          </div>

          <dl className="about-facts">
            {aboutFacts.map((fact) => (
              <div className="about-fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about-gallery">
          <PhotoCarousel
            photos={photos}
            note="same guy who overthinks everything but keeps building anyway."
          />
        </div>
      </div>
    </section>
  )
}

export default About
