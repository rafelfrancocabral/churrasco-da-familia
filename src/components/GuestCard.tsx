import type { CSSProperties } from 'react'
import type { Guest } from '../types'

type CSSVars = CSSProperties & Record<`--${string}`, string | number>

interface GuestCardProps {
  guest: Guest
  index: number
}

export function GuestCard({ guest, index }: GuestCardProps) {
  return (
    <div
      className="cw tilt gold"
      style={{ '--i': index } as CSSVars}
      aria-label={`${guest.name}, camisa ${guest.shirtNumber}, confirmado`}
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
          <b>{guest.shirtNumber}</b>
          <span>Nº</span>
        </div>
        <div className="av">{guest.emoji}</div>
        <div className="nm">{guest.name}</div>
        <div className="st">
          {guest.stats.map((stat) => (
            <span key={stat.label}>
              {stat.label} <b>{stat.value}</b>
            </span>
          ))}
        </div>
        <div className="lv">
          <span>Skill:</span> {guest.brings}
        </div>
      </div>
    </div>
  )
}
