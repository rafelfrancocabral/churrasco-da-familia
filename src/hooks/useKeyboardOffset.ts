import { useEffect, type RefObject } from 'react'

let activeSheets = 0

/**
 * Mantém o sheet e o campo focado visíveis quando o teclado do celular abre.
 * Também expõe a altura real da área visível (--vvh) para o CSS não usar a
 * altura do layout viewport, que continua cobrindo o teclado no iOS/Android.
 */
export function useKeyboardOffset(sheetRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    activeSheets += 1

    const viewport = window.visualViewport
    const root = document.documentElement
    let frame = 0

    const revealFocused = () => {
      const sheet = sheetRef.current
      if (!sheet) return

      const active = document.activeElement
      if (!(active instanceof HTMLElement) || !sheet.contains(active)) return

      const sheetRect = sheet.getBoundingClientRect()
      const fieldRect = active.getBoundingClientRect()
      const gap = 14

      if (fieldRect.top < sheetRect.top + gap) {
        sheet.scrollTop -= sheetRect.top + gap - fieldRect.top
      } else if (fieldRect.bottom > sheetRect.bottom - gap) {
        sheet.scrollTop += fieldRect.bottom - (sheetRect.bottom - gap)
      }
    }

    const scheduleReveal = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(revealFocused)
    }

    const update = () => {
      const height = viewport?.height ?? window.innerHeight
      const offsetTop = viewport?.offsetTop ?? 0
      const keyboard = viewport
        ? Math.max(0, window.innerHeight - height - offsetTop)
        : 0

      root.style.setProperty('--kb', `${keyboard}px`)
      root.style.setProperty('--vvh', `${height}px`)
      scheduleReveal()
    }

    const onFocus = (event: FocusEvent) => {
      const sheet = sheetRef.current
      if (sheet && event.target instanceof Node && sheet.contains(event.target)) {
        scheduleReveal()
      }
    }

    update()
    viewport?.addEventListener('resize', update)
    viewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    document.addEventListener('focusin', onFocus)

    return () => {
      viewport?.removeEventListener('resize', update)
      viewport?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      document.removeEventListener('focusin', onFocus)
      cancelAnimationFrame(frame)

      activeSheets -= 1
      if (activeSheets === 0) {
        root.style.removeProperty('--kb')
        root.style.removeProperty('--vvh')
      }
    }
  }, [sheetRef])
}
