import { contactDetails } from '../data/contact'
import './Contact.css'

interface ContactMethod {
  label: string
  title: string
  description: string
  href: string
  action?: string
}

const currentYear = new Date().getFullYear()

export function Contact() {
  const methods: ContactMethod[] = [
    {
      label: 'SEND AN EMAIL',
      title: "Let’s talk about your idea.",
      description: 'Whether it’s a project, collaboration, internship opportunity, or just a random idea — I’m always open to a good conversation.',
      href: `mailto:${contactDetails.email}`,
      action: 'Send an email',
    },
    {
      label: 'GITHUB',
      title: 'Check out my code.',
      description: 'Open source projects, experiments and more.',
      href: contactDetails.githubUrl,
    },
    {
      label: 'LINKEDIN',
      title: 'Let’s connect.',
      description: 'Updates, projects, and professional journey.',
      href: contactDetails.linkedInUrl,
    },
  ]

  return (
    <>
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="contact-inner">
          <div className="contact-layout">
            <div className="contact-copy">
              <div className="contact-kicker">
                <p>05 — CONTACT</p>
                <span aria-hidden="true" />
              </div>

              <h2 id="contact-title" className="contact-title">
                <span>Have an idea?</span>
                <em>Let&apos;s build something meaningful.</em>
              </h2>
              <p className="contact-description">
                For collaborations, interesting problems, projects, or just a conversation
                about technology and ideas.
              </p>
              <p className="contact-note">Open to opportunities,<br />exciting projects and<br />like-minded people.<span aria-hidden="true">↘</span></p>
            </div>

            <div className="contact-methods" aria-label="Contact options">
              {methods.map((method) => (
                <a
                  className={`contact-card${method.action ? ' contact-card--email' : ''}`}
                  href={method.href}
                  key={method.label}
                  target={method.label === 'SEND AN EMAIL' ? undefined : '_blank'}
                  rel={method.label === 'SEND AN EMAIL' ? undefined : 'noreferrer'}
                  aria-label={`${method.title} ${method.label === 'SEND AN EMAIL' ? `Send an email to ${contactDetails.email}` : `Open ${method.label} profile`}`}
                >
                  <span className="contact-card__label">{method.label}</span>
                  <span className="contact-card__title">{method.title}</span>
                  <span className="contact-card__description">{method.description}</span>
                  {method.action && <span className="contact-card__action">{method.action} <span aria-hidden="true">↗</span></span>}
                  <span className="contact-card__arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <a className="contact-footer__top" href="#top">↑ Back to top</a>
          <footer className="contact-footer">
            <div className="contact-footer__location">
              <span>{contactDetails.location}</span>
              <span>Building things that matter.</span>
            </div>
            <span className="contact-footer__signoff">Built with curiosity.</span>
            <div className="contact-footer__copyright">
              <div className="contact-footer__socials" aria-label="Contact links">
                <a href={contactDetails.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">GH</a>
                <a href={contactDetails.linkedInUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">in</a>
                <a href={`mailto:${contactDetails.email}`} aria-label="Send email">✉</a>
              </div>
              <span>© {currentYear} Aparmit Srivastav. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </section>
    </>
  )
}

export default Contact
