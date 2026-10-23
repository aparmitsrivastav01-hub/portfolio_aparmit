import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import './Journey.css'

interface JourneyMilestone {
  id: number
  date: string
  title: string
  description: string
  x: number
  y: number
  mobileX: number
  labelSide: 'above' | 'below'
}

interface JourneyProps {
  className?: string
}

interface PopupPosition {
  left: number
  top: number
  side: 'above' | 'below'
}

interface MilestoneButtonRefs {
  desktop?: HTMLButtonElement
  mobile?: HTMLButtonElement
}

const VIEWBOX_WIDTH = 1100
const VIEWBOX_HEIGHT = 260
const MOBILE_ROW_HEIGHT = 112
const MOBILE_ROW_CENTER = MOBILE_ROW_HEIGHT / 2

const milestones: JourneyMilestone[] = [
  {
    id: 1,
    date: '2020–2021',
    title: 'Curiosity Begins',
    description: 'During lockdown, I learned HTML, CSS, JavaScript, Tailwind CSS, and WordPress through CodeWithHarry. I built a basic Jarvis-like assistant using if/else statements and discovered how much I could create through code.',
    x: 34, y: 150, mobileX: 31, labelSide: 'below',
  },
  {
    id: 2,
    date: 'Class 7–8',
    title: 'First Freelance Work',
    description: 'I worked on frontend websites for an esports organization and earned my first small payments from coding.',
    x: 148, y: 120, mobileX: 39, labelSide: 'above',
  },
  {
    id: 3,
    date: 'Class 9',
    title: '3D & Game Development',
    description: 'I explored Blender and Unreal Engine, learned 3D asset creation, and completed small paid freelance asset work for a friend developing games.',
    x: 262, y: 176, mobileX: 30, labelSide: 'below',
  },
  {
    id: 4,
    date: 'Class 10',
    title: 'The Reality Check',
    description: 'I struggled with mathematics despite preparing hard and scored 78% in my board examinations. My original engineering plans had to change.',
    x: 376, y: 118, mobileX: 39, labelSide: 'above',
  },
  {
    id: 5,
    date: 'Class 11',
    title: 'Esports Era',
    description: 'I focused on competitive esports for a year, finishing #5 at NPGC Lucknow and #2 at the IIIT Delhi esports tournament. Eventually, I decided to pursue a different direction.',
    x: 490, y: 170, mobileX: 30, labelSide: 'below',
  },
  {
    id: 6,
    date: 'Class 12',
    title: 'The FinSight Idea',
    description: 'An Accountancy practical involving Infosys financial-statement analysis sparked the idea of combining finance, accounting, and AI into FinSight.',
    x: 604, y: 108, mobileX: 39, labelSide: 'above',
  },
  {
    id: 7,
    date: '2026',
    title: 'Learning to Build Again',
    description: 'I scored 89.2% in CBSE Class 12. I studied Python, OOP, NumPy, Pandas, Matplotlib, Seaborn, JavaScript, and React while beginning the IIT Madras BS in Data Science and Applications.',
    x: 718, y: 162, mobileX: 30, labelSide: 'below',
  },
  {
    id: 8,
    date: '2026',
    title: 'FinSight & First Pitch',
    description: 'I built the first FinSight prototype and got an opportunity to pitch it at a builder show at Mayson AI, gaining useful feedback and insights.',
    x: 832, y: 112, mobileX: 39, labelSide: 'above',
  },
  {
    id: 9,
    date: '2026',
    title: 'NST Hackathon: Top 8',
    description: 'I secured 8th place in a 48-hour online hackathon organized by Newton School of Technology × Headstart. This qualified me for a sponsored trip to Bengaluru, where I met mentors and industry professionals, pitched my startup idea, and received guidance.',
    x: 946, y: 174, mobileX: 30, labelSide: 'below',
  },
  {
    id: 10,
    date: '2026',
    title: 'Building in the Real World',
    description: 'I collaborated with Nitin Paliwal on client projects, helped build a website for Black Cat Gym, secured 2nd place in the Gemini AI Prompt Challenge, and secured 3rd place at the SRM hackathon with Dawa-Wise. I am continuing work on FinSight v2 and an OpenClaw clone.',
    x: 1050, y: 104, mobileX: 39, labelSide: 'above',
  },
]

function createSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return ''
  const [first, ...rest] = points
  return rest.reduce((path, point, index) => {
    const previous = index === 0 ? first : rest[index - 1]
    const controlOffset = (point.x - previous.x) * 0.36
    return `${path} C ${previous.x + controlOffset} ${previous.y}, ${point.x - controlOffset} ${point.y}, ${point.x} ${point.y}`
  }, `M ${first.x} ${first.y}`)
}

function createMobilePath(): string {
  const points = milestones.map((milestone, index) => ({
    x: milestone.mobileX,
    y: MOBILE_ROW_CENTER + index * MOBILE_ROW_HEIGHT,
  }))
  return createSmoothPath(points)
}

const desktopPath = createSmoothPath(milestones.map(({ x, y }) => ({ x, y })))
const mobilePath = createMobilePath()

function formatNumber(id: number): string {
  return String(id).padStart(2, '0')
}

export function Journey({ className = '' }: JourneyProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLElement>(null)
  const milestoneRefs = useRef(new Map<number, MilestoneButtonRefs>())
  const closeTimer = useRef<number | null>(null)

  const activeMilestone = useMemo(
    () => milestones.find((milestone) => milestone.id === activeId) ?? null,
    [activeId],
  )

  const placePopup = useCallback(() => {
    if (activeId === null || !timelineRef.current || !popupRef.current) return

    const anchor = window.matchMedia('(max-width: 767px)').matches
      ? milestoneRefs.current.get(activeId)?.mobile
      : milestoneRefs.current.get(activeId)?.desktop
    if (!anchor) return

    const timelineBounds = timelineRef.current.getBoundingClientRect()
    const anchorBounds = anchor.getBoundingClientRect()
    const popupBounds = popupRef.current.getBoundingClientRect()
    const anchorX = anchorBounds.left + anchorBounds.width / 2 - timelineBounds.left
    const anchorTop = anchorBounds.top - timelineBounds.top
    const anchorBottom = anchorBounds.bottom - timelineBounds.top
    const popupWidth = popupBounds.width
    const popupHeight = popupBounds.height
    const left = Math.max(10, Math.min(anchorX - popupWidth / 2, timelineBounds.width - popupWidth - 10))
    const spaceAbove = anchorTop - 16
    const spaceBelow = timelineBounds.height - anchorBottom - 16

    let side: PopupPosition['side']
    let top: number
    if (spaceAbove >= popupHeight) {
      side = 'above'
      top = anchorTop - popupHeight - 16
    } else if (spaceBelow >= popupHeight) {
      side = 'below'
      top = anchorBottom + 16
    } else if (spaceAbove > spaceBelow) {
      side = 'above'
      top = Math.max(8, anchorTop - popupHeight - 12)
    } else {
      side = 'below'
      top = Math.min(timelineBounds.height - popupHeight - 8, anchorBottom + 12)
    }

    setPopupPosition({ left, top, side })
  }, [activeId])

  useLayoutEffect(() => {
    if (activeId === null) {
      setPopupPosition(null)
      return
    }

    placePopup()
    window.addEventListener('resize', placePopup)
    window.addEventListener('scroll', placePopup, { passive: true })
    return () => {
      window.removeEventListener('resize', placePopup)
      window.removeEventListener('scroll', placePopup)
    }
  }, [activeId, placePopup])

  useEffect(() => {
    if (activeId === null) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!timelineRef.current?.contains(event.target as Node)) {
        setActiveId(null)
      }
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeId])

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
  }, [])

  const openMilestone = (id: number) => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setActiveId(id)
  }

  const scheduleClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setActiveId(null), 180)
  }

  const handleMilestoneKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const offset = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + offset + milestones.length) % milestones.length
    const nextMilestone = milestones[nextIndex]
    openMilestone(nextMilestone.id)
    const isMobilePlot = event.currentTarget.closest('.journey-plot--mobile') !== null
    const nextButton = milestoneRefs.current.get(nextMilestone.id)
    ;(isMobilePlot ? nextButton?.mobile : nextButton?.desktop)?.focus()
  }

  const desktopPointStyle = (milestone: JourneyMilestone): CSSProperties => ({
    left: `${(milestone.x / VIEWBOX_WIDTH) * 100}%`,
    top: `${(milestone.y / VIEWBOX_HEIGHT) * 100}%`,
  })

  const mobilePointStyle = (milestone: JourneyMilestone): CSSProperties => ({
    '--mobile-point-x': `${milestone.mobileX}px`,
  } as CSSProperties)

  const milestoneButton = (milestone: JourneyMilestone, index: number, mobile = false) => (
    <button
      ref={(node) => {
        const refs = milestoneRefs.current.get(milestone.id) ?? {}
        const key = mobile ? 'mobile' : 'desktop'
        if (node) refs[key] = node
        else delete refs[key]
        if (refs.desktop || refs.mobile) milestoneRefs.current.set(milestone.id, refs)
        else milestoneRefs.current.delete(milestone.id)
      }}
      className={`journey-milestone journey-milestone--${milestone.labelSide}${activeId === milestone.id ? ' is-active' : ''}`}
      style={mobile ? mobilePointStyle(milestone) : desktopPointStyle(milestone)}
      type="button"
      aria-label={`Show details for ${milestone.title}`}
      aria-expanded={activeId === milestone.id}
      aria-controls={`journey-popup-${milestone.id}`}
      onMouseEnter={() => openMilestone(milestone.id)}
      onFocus={() => openMilestone(milestone.id)}
      onBlur={(event) => {
        if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
          scheduleClose()
        }
      }}
      onClick={() => openMilestone(milestone.id)}
      onKeyDown={(event) => handleMilestoneKeyDown(event, index)}
    >
      <span className="journey-milestone__dot" aria-hidden="true" />
      <span className="journey-milestone__label">
        <span className="journey-milestone__number">{formatNumber(milestone.id)}</span>
        <span className="journey-milestone__title">{milestone.title}</span>
      </span>
    </button>
  )

  const endpointX = `${(1086 / VIEWBOX_WIDTH) * 100}%`
  const endpointY = `${(78 / VIEWBOX_HEIGHT) * 100}%`

  return (
    <section id="journey" className={`journey-section ${className}`.trim()} aria-labelledby="journey-title">
      <div className="journey-inner">
        <div className="journey-kicker">
          <p>03 — JOURNEY</p>
          <span aria-hidden="true" />
        </div>

        <div className="journey-intro">
          <h2 id="journey-title" className="journey-title">
            A short journey,<br />
            a long way to <em>go.</em>
          </h2>
          <p className="journey-summary">
            From a curious kid in lockdown to a builder working on AI, finance and
            real-world products. Different phases, different interests, same curiosity
            to keep creating, learning and building.
          </p>
          <p className="journey-side-note">same curiosity.<br />bigger dreams now.<span aria-hidden="true">↘</span></p>
        </div>

        <div
          className="journey-timeline"
          ref={timelineRef}
          onMouseLeave={scheduleClose}
          onMouseEnter={() => {
            if (closeTimer.current !== null) {
              window.clearTimeout(closeTimer.current)
              closeTimer.current = null
            }
          }}
        >
          <div className="journey-plot journey-plot--desktop">
            <svg
              className="journey-svg"
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="journey-svg__main-path" d={desktopPath} />
              <path
                className="journey-svg__continuation"
                d={`M ${milestones[milestones.length - 1].x} ${milestones[milestones.length - 1].y} C 1064 94, 1071 78, 1086 78`}
              />
            </svg>
            {milestones.map((milestone, index) => (
              <span className="journey-point-wrap" key={milestone.id}>
                {milestoneButton(milestone, index)}
              </span>
            ))}
            <span className="journey-endpoint" style={{ left: endpointX, top: endpointY }} aria-hidden="true" />
            <p className="journey-endpoint-note">Still curious.<br />Still building.</p>
          </div>

          <div className="journey-plot journey-plot--mobile">
            <svg
              className="journey-svg journey-svg--mobile"
              viewBox={`0 0 80 ${milestones.length * MOBILE_ROW_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="journey-svg__main-path" d={mobilePath} />
              <path
                className="journey-svg__continuation"
                d={`M ${milestones[milestones.length - 1].mobileX} ${MOBILE_ROW_CENTER + (milestones.length - 1) * MOBILE_ROW_HEIGHT} C 48 ${MOBILE_ROW_CENTER + (milestones.length - 1) * MOBILE_ROW_HEIGHT + 20}, 50 ${MOBILE_ROW_CENTER + (milestones.length - 1) * MOBILE_ROW_HEIGHT + 36}, 55 ${MOBILE_ROW_CENTER + (milestones.length - 1) * MOBILE_ROW_HEIGHT + 52}`}
              />
            </svg>
            <ol className="journey-mobile-list">
              {milestones.map((milestone, index) => (
                <li className="journey-mobile-list__item" key={milestone.id}>
                  {milestoneButton(milestone, index, true)}
                </li>
              ))}
            </ol>
            <span className="journey-endpoint journey-endpoint--mobile" aria-hidden="true" />
            <p className="journey-endpoint-note journey-endpoint-note--mobile">Still curious. Still building.</p>
          </div>

          {activeMilestone && (
            <article
              id={`journey-popup-${activeMilestone.id}`}
              ref={popupRef}
              className={`journey-popup${popupPosition ? ` journey-popup--${popupPosition.side}` : ''}`}
              style={popupPosition ? { left: popupPosition.left, top: popupPosition.top } : undefined}
              aria-labelledby={`journey-popup-title-${activeMilestone.id}`}
              onMouseEnter={() => {
                if (closeTimer.current !== null) {
                  window.clearTimeout(closeTimer.current)
                  closeTimer.current = null
                }
              }}
              onMouseLeave={scheduleClose}
            >
              <span className="journey-popup__date">{activeMilestone.date}</span>
              <h3 id={`journey-popup-title-${activeMilestone.id}`}>{activeMilestone.title}</h3>
              <p>{activeMilestone.description}</p>
            </article>
          )}
        </div>

        <footer className="journey-footer">
          <p><span aria-hidden="true" />Hover over the points to see my journey.</p>
          <p>10 moments. Many more ahead.<span aria-hidden="true" /></p>
        </footer>
      </div>
    </section>
  )
}

export default Journey
