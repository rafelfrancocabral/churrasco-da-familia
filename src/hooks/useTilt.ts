import { useEffect } from 'react'

/** Efeito 3D por pointer events, idêntico ao da referência (sem libs de animação). */
export function useTilt() {
  useEffect(() => {
    const tiltFrom = (target: EventTarget | null) =>
      target instanceof Element ? (target.closest<HTMLElement>('.tilt') ?? null) : null

    const onMove = (event: PointerEvent) => {
      const el = tiltFrom(event.target)
      if (!el) return

      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      el.classList.remove('rest')
      el.style.setProperty('--ry', `${(px - 0.5) * 16}deg`)
      el.style.setProperty('--rx', `${(0.5 - py) * 16}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
      el.style.setProperty('--go', '1')
    }

    const onEnd = (event: Event) => {
      const el = tiltFrom(event.target)
      if (!el) return

      el.classList.add('rest')
      for (const key of ['--rx', '--ry', '--go']) el.style.removeProperty(key)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onEnd)
    document.addEventListener('pointerleave', onEnd, true)
    document.addEventListener('pointercancel', onEnd)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onEnd)
      document.removeEventListener('pointerleave', onEnd, true)
      document.removeEventListener('pointercancel', onEnd)
    }
  }, [])
}
