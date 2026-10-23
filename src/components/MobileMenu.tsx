import { useEffect, useRef, useState } from 'react'
import './MobileMenu.css'

export interface MobileNavigationItem {
  label: string
  href: string
}

export interface MobileMenuProps {
  items: readonly MobileNavigationItem[]
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="mobile-menu">
      <button
        ref={triggerRef}
        className="mobile-menu__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-overlay"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div
        id="mobile-navigation-overlay"
        className="mobile-menu__overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!isOpen}
      >
        <div className="mobile-menu__topbar">
          <span>MENU</span>
          <button className="mobile-menu__close" type="button" onClick={closeMenu}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation links">
          <ul className="mobile-menu__links">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu
