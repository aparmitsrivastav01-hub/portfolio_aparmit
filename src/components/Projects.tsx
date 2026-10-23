import { useState } from 'react'
import { GitHubActivity } from './GitHubActivity'
import { projects, type PortfolioProject } from '../data/projects'
import './Projects.css'

function ProjectLinks({ project }: { project: PortfolioProject }) {
  if (!project.liveUrl && !project.repositoryUrl) {
    return <p className="project-links__unavailable">No verified public project links are available.</p>
  }

  return (
    <div className="project-links">
      {project.liveUrl && (
        <a className="project-links__primary" href={project.liveUrl} target="_blank" rel="noreferrer">
          View Project <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.repositoryUrl && (
        <a className="project-links__secondary" href={project.repositoryUrl} target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}

function ProjectDetails({ project }: { project: PortfolioProject }) {
  return (
    <div className="project-feature__content" aria-live="polite" aria-atomic="true">
      <div className="project-feature__main">
        <p className="project-feature__type">{project.type}</p>
        <h3 className="project-feature__name">{project.name}</h3>
        <p className="project-feature__summary">{project.summary}</p>

        <div className="project-feature__overview">
          <h4>Overview</h4>
          <p>{project.overview}</p>
        </div>

        <div className="project-feature__features">
          <h4>Key features</h4>
          {project.features.length > 0 ? (
            <ul>
              {project.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          ) : (
            <p className="project-feature__unverified">No additional features have been verified yet.</p>
          )}
        </div>
      </div>

      <aside className="project-feature__details" aria-label={`${project.name} project details`}>
        <dl className="project-facts">
          <div>
            <dt>Status</dt>
            <dd><span className="project-facts__status-dot" aria-hidden="true" />{project.status}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{project.period ?? 'Not verified'}</dd>
          </div>
        </dl>

        <div className="project-stack">
          <h4>Technologies</h4>
          {project.technologies.length > 0 ? (
            <ul>
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          ) : (
            <p>Not verified</p>
          )}
        </div>

        {project.verificationNote && (
          <p className="project-feature__verification">{project.verificationNote}</p>
        )}
        <ProjectLinks project={project} />
      </aside>
    </div>
  )
}

export function Projects() {
  const [selectedId, setSelectedId] = useState(projects[0].id)
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0]

  return (
    <section id="work" className="projects-section" aria-labelledby="projects-title">
      <div className="projects-inner">
        <header className="projects-heading">
          <p className="projects-heading__eyebrow">04 — PROJECTS</p>
          <div className="projects-heading__layout">
            <h2 id="projects-title">Things I’ve built,<br />and still building.</h2>
            <p>
              A collection of projects that reflect my curiosity, interests and learning
              journey — from building small side projects to real-world products.
            </p>
          </div>
        </header>

        <section className="project-feature" aria-label="Selected project">
          <div className="project-feature__topline">
            <span>FEATURED PROJECT</span>
            <span>{String(selectedProject.id).padStart(2, '0')} <span aria-hidden="true">/</span> {String(projects.length).padStart(2, '0')}</span>
          </div>
          <ProjectDetails key={selectedProject.id} project={selectedProject} />
        </section>

        <div className="project-selector" role="group" aria-label="Choose a project">
          {projects.map((project) => (
            <button
              key={project.id}
              className={`project-selector__item${selectedId === project.id ? ' is-selected' : ''}`}
              type="button"
              aria-pressed={selectedId === project.id}
              onClick={() => setSelectedId(project.id)}
            >
              <span className="project-selector__number">{String(project.id).padStart(2, '0')}</span>
              <span className="project-selector__name">{project.name}</span>
              <span className="project-selector__summary">{project.summary}</span>
              <span className="project-selector__status">{project.status}</span>
            </button>
          ))}
        </div>

        <GitHubActivity />
      </div>
    </section>
  )
}

export default Projects
