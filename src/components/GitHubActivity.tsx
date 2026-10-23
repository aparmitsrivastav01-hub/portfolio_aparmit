import { useEffect, useState } from 'react'
import './GitHubActivity.css'

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ContributionResponse {
  total: Record<string, number>
  contributions: ContributionDay[]
}

interface ContributionWeek {
  days: Array<ContributionDay | null>
  monthLabel?: string
}

type ActivityState =
  | { status: 'loading' }
  | { status: 'loaded'; weeks: ContributionWeek[]; total: number }
  | { status: 'error' }

const username = 'aparmitsrivastav01-hub'
const profileUrl = `https://github.com/${username}`
const activityUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })

function isContributionResponse(value: unknown): value is ContributionResponse {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<ContributionResponse>
  return typeof candidate.total === 'object'
    && candidate.total !== null
    && Array.isArray(candidate.contributions)
    && candidate.contributions.every((day) => (
      typeof day?.date === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(day.date)
      && Number.isFinite(day.count)
      && Number.isInteger(day.level)
      && day.level >= 0
      && day.level <= 4
    ))
}

function makeWeeks(days: ContributionDay[]): ContributionWeek[] {
  if (days.length === 0) return []

  const firstDate = new Date(`${days[0].date}T00:00:00Z`)
  const cells: Array<ContributionDay | null> = [
    ...Array.from({ length: firstDate.getUTCDay() }, () => null),
    ...days,
  ]
  const weeks: ContributionWeek[] = []

  for (let index = 0; index < cells.length; index += 7) {
    const weekDays = cells.slice(index, index + 7)
    while (weekDays.length < 7) weekDays.push(null)
    weeks.push({ days: weekDays })
  }

  let lastMonth = ''
  weeks.forEach((week, index) => {
    const firstDay = week.days.find((day): day is ContributionDay => day !== null)
    const monthStart = week.days.find((day) => day?.date.endsWith('-01'))
    const labelDay = index === 0 ? firstDay : monthStart
    if (!labelDay) return

    const date = new Date(`${labelDay.date}T00:00:00Z`)
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    if (monthKey !== lastMonth) {
      week.monthLabel = monthFormatter.format(date)
      lastMonth = monthKey
    }
  })

  return weeks
}

export function GitHubActivity() {
  const [activity, setActivity] = useState<ActivityState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivity() {
      try {
        const response = await fetch(activityUrl, { signal: controller.signal })
        if (!response.ok) throw new Error(`Contribution request failed (${response.status}).`)
        const data: unknown = await response.json()
        if (!isContributionResponse(data)) throw new Error('Contribution data was not in the expected format.')

        const days = data.contributions
        const reportedTotal = data.total.lastYear ?? data.total['lastYear']
        const total = Number.isFinite(reportedTotal)
          ? reportedTotal
          : days.reduce((sum, day) => sum + day.count, 0)

        setActivity({ status: 'loaded', weeks: makeWeeks(days), total })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setActivity({ status: 'error' })
      }
    }

    void loadActivity()
    return () => controller.abort()
  }, [])

  return (
    <section className="github-activity" aria-labelledby="github-activity-title">
      <div className="github-activity__heading">
        <div>
          <p className="github-activity__eyebrow">OPEN SOURCE · LAST 12 MONTHS</p>
          <h2 id="github-activity-title">GitHub activity</h2>
        </div>
        <a href={profileUrl} target="_blank" rel="noreferrer">
          @{username} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {activity.status === 'loading' && (
        <p className="github-activity__message" role="status">Loading current GitHub activity…</p>
      )}

      {activity.status === 'error' && (
        <p className="github-activity__message" role="status">
          Live contribution data is temporarily unavailable.{' '}
          <a href={profileUrl} target="_blank" rel="noreferrer">View the activity on GitHub ↗</a>
        </p>
      )}

      {activity.status === 'loaded' && activity.weeks.length > 0 && (
        <>
          <p className="github-activity__total">
            <strong>{activity.total.toLocaleString()}</strong> contributions in the last 12 months
          </p>
          <div className="github-activity__scroller" tabIndex={0} aria-label="Scrollable GitHub contribution calendar">
            <div className="github-calendar">
              <div className="github-calendar__month-row" aria-hidden="true">
                {activity.weeks.map((week, index) => week.monthLabel ? (
                  <span key={`${week.monthLabel}-${index}`} style={{ gridColumn: index + 1 }}>{week.monthLabel}</span>
                ) : null)}
              </div>
              <div className="github-calendar__body">
                <div className="github-calendar__weekdays" aria-hidden="true">
                  <span />
                  <span>Mon</span>
                  <span />
                  <span>Wed</span>
                  <span />
                  <span>Fri</span>
                  <span />
                </div>
                <div
                  className="github-calendar__weeks"
                  role="img"
                  aria-label={`Contribution calendar showing ${activity.total.toLocaleString()} contributions during the last 12 months.`}
                >
                  {activity.weeks.map((week, weekIndex) => (
                    <div className="github-calendar__week" key={weekIndex}>
                      {week.days.map((day, dayIndex) => day ? (
                        <span
                          key={day.date}
                          className={`github-calendar__day github-calendar__day--${day.level}`}
                          title={`${day.date}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
                          aria-hidden="true"
                        />
                      ) : <span key={`blank-${weekIndex}-${dayIndex}`} />)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="github-activity__legend" aria-label="Contribution intensity: less to more">
            <span>Less</span>
            <i className="github-calendar__day--0" />
            <i className="github-calendar__day--1" />
            <i className="github-calendar__day--2" />
            <i className="github-calendar__day--3" />
            <i className="github-calendar__day--4" />
            <span>More</span>
          </div>
        </>
      )}

      {activity.status === 'loaded' && activity.weeks.length === 0 && (
        <p className="github-activity__message" role="status">
          No contribution days were returned.{' '}
          <a href={profileUrl} target="_blank" rel="noreferrer">View GitHub ↗</a>
        </p>
      )}
      <p className="github-activity__source">Live public contribution data · <a href="https://github.com/grubersjoe/github-contributions-api" target="_blank" rel="noreferrer">data source</a></p>
    </section>
  )
}
