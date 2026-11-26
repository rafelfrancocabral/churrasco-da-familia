import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { vib } from '../utils/vib'
import type { Guest } from '../types'

type CSSVars = CSSProperties & Record<`--${string}`, string | number>

interface GuestCardProps {
  guest: Guest
  index: number
  onToggle: () => void
}

export function GuestCard({ guest, index, onToggle }: GuestCardProps) {
  const tier = guest.confirmed ? 'gold' : 'out'
  const [pop, setPop] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = () => {
    onToggle()
    vib()
    if (!guest.confirmed) {
      setPop(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setPop(false), 600)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <div
      className={`cw tilt ${tier} pk${pop ? ' pop' : ''}`}
      style={{ '--i': index } as CSSVars}
      role="button"
      tabIndex={0}
      aria-pressed={guest.confirmed}
      aria-label={`${guest.name}, nota ${guest.overall}, ${guest.confirmed ? 'confirmado' : 'pendente'}`}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <div className="card">
        <i className="bz" />
        <i className="bz2" />
        <i className="rays" />
        <i className="holo" />
        <i className="shine" style={{ animationDelay: `${index * 0.7}s` }} />
        <i className="glare" />
      </div>
      <div className="ct">
        <div className="ovr">
          <b>{guest.overall}</b>
          <span>{guest.position}</span>
        </div>
        <div className="bd">{guest.confirmed ? '✅' : '⏳'}</div>
        <div className="av">{guest.emoji}</div>
        <div className="nm">{guest.name}</div>
        <div className="st">
          {guest.stats.map((stat) => (
            <span key={stat.label}>
              {stat.label} <b>{stat.value}</b>
            </span>
          ))}
        </div>
        <div className="lv">Skill: {guest.brings}</div>
      </div>
    </div>
  )
}
