import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import './PhotoCarousel.css'

export interface CarouselPhoto {
  src: string
  alt: string
  caption: string
}

export interface PhotoCarouselProps {
  photos: CarouselPhoto[]
  note?: string
}

type SlideDirection = 'next' | 'previous'

interface SlideTransition {
  from: number
  to: number
  direction: SlideDirection
}

const TRANSITION_DURATION = 350

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}

export function PhotoCarousel({ photos, note }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() => Math.min(2, Math.max(photos.length - 1, 0)))
  const [transition, setTransition] = useState<SlideTransition | null>(null)
  const touchStartX = useRef<number | null>(null)
  const transitionTimer = useRef<number | null>(null)

  const photoCount = photos.length
  const safeIndex = photoCount > 0 ? activeIndex % photoCount : 0
  const activePhoto = photos[safeIndex]

  const changePhoto = useCallback((direction: SlideDirection) => {
    if (photoCount < 2) return

    const from = safeIndex
    const to = direction === 'next'
      ? (from + 1) % photoCount
      : (from - 1 + photoCount) % photoCount

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current)
    }

    setTransition({ from, to, direction })
    setActiveIndex(to)
    transitionTimer.current = window.setTimeout(() => {
      setTransition(null)
      transitionTimer.current = null
    }, TRANSITION_DURATION)
  }, [photoCount, safeIndex])

  const showPrevious = useCallback(() => changePhoto('previous'), [changePhoto])
  const showNext = useCallback(() => changePhoto('next'), [changePhoto])

  useEffect(() => () => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current)
    }
  }, [])

  useEffect(() => {
    if (photoCount < 2) return

    const previousIndex = (safeIndex - 1 + photoCount) % photoCount
    const nextIndex = (safeIndex + 1) % photoCount
    const previousImage = new Image()
    const nextImage = new Image()
    previousImage.src = photos[previousIndex].src
    nextImage.src = photos[nextIndex].src
  }, [photos, photoCount, safeIndex])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      showNext()
    }
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX
    touchStartX.current = null

    if (startX === null || endX === undefined) return
    const distance = endX - startX
    if (Math.abs(distance) < 40) return
    if (distance < 0) showNext()
    else showPrevious()
  }

  return (
    <div
      className="photo-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="About photos"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="photo-carousel__frame">
        <div className="photo-carousel__tape" aria-hidden="true" />
        <div className="photo-carousel__viewport">
          {transition && (
            <img
              key={`outgoing-${transition.from}-${transition.to}`}
              className={`photo-carousel__image photo-carousel__image--outgoing photo-carousel__image--${transition.direction}`}
              src={photos[transition.from]?.src}
              alt=""
              aria-hidden="true"
            />
          )}
          {activePhoto && (
            <img
              key={activePhoto.src}
              className={`photo-carousel__image${transition ? ` photo-carousel__image--incoming photo-carousel__image--${transition.direction}` : ''}`}
              src={activePhoto.src}
              alt={transition ? '' : activePhoto.alt}
              aria-hidden={transition ? 'true' : undefined}
              loading="eager"
            />
          )}
        </div>
        <div className="photo-carousel__caption" aria-live="polite" aria-atomic="true">
          {activePhoto?.caption ?? 'No photos available'}
        </div>
      </div>

      {photoCount > 1 && (
        <div className="photo-carousel__controls">
          <button
            className="photo-carousel__button"
            type="button"
            aria-label="Previous photo"
            onClick={showPrevious}
          >
            ←
          </button>
          <span className="photo-carousel__counter" aria-live="polite" aria-atomic="true">
            {formatIndex(safeIndex)} / {String(photoCount).padStart(2, '0')}
          </span>
          <button
            className="photo-carousel__button"
            type="button"
            aria-label="Next photo"
            onClick={showNext}
          >
            →
          </button>
        </div>
      )}

      {note && <p className="photo-carousel__note">{note}</p>}
    </div>
  )
}

export default PhotoCarousel
