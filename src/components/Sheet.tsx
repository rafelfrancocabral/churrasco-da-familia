import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useKeyboardOffset } from '../hooks/useKeyboardOffset'

interface SheetProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Sheet({ title, onClose, children }: SheetProps) {
  useKeyboardOffset()

  return createPortal(
    <div
      className="ov on"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>,
    document.body,
  )
}
