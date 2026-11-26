import { useEffect, useRef, useState, type FormEvent } from 'react'
import { EMOJIS } from '../data/seed'
import { vib } from '../utils/vib'
import { Sheet } from './Sheet'
import type { Attribute, Guest } from '../types'

export type GuestSheetState = { kind: 'add' } | { kind: 'pick' } | { kind: 'edit'; id: number }

interface GuestSheetProps {
  state: GuestSheetState
  guests: Guest[]
  nextId: number
  onClose: () => void
  onPick?: (id: number) => void
  onSave: (guest: Guest) => void
  onDelete?: () => void
}

const clamp = (value: number) => Math.min(99, Math.max(0, Math.round(value)))

/** Durante a edição o valor pode ficar vazio para o usuário digitar de novo. */
type StatDraft = { label: string; value: number | '' }

const NEW_STATS: Attribute[] = [
  { label: 'BEER', value: 90 },
  { label: 'FOME', value: 80 },
  { label: 'SOS', value: 70 },
]

export function GuestSheet({
  state,
  guests,
  nextId,
  onClose,
  onPick,
  onSave,
  onDelete,
}: GuestSheetProps) {
  const existing = state.kind === 'edit' ? guests.find((guest) => guest.id === state.id) : undefined
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(existing?.name ?? '')
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🧑')
  const [position, setPosition] = useState(existing?.position ?? 'NOVO')
  const [shirtNumber, setShirtNumber] = useState(
    String(existing?.shirtNumber ?? guests.length + 1),
  )
  const [overall, setOverall] = useState(String(existing?.overall ?? 75))
  const [brings, setBrings] = useState(existing?.brings ?? '')
  const [confirmed, setConfirmed] = useState(existing?.confirmed ?? true)
  const [stats, setStats] = useState<StatDraft[]>(
    existing ? existing.stats.map((stat) => ({ ...stat })) : NEW_STATS.map((stat) => ({ ...stat })),
  )
  const [invalidName, setInvalidName] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(
      () => nameRef.current?.focus({ preventScroll: true }),
      420,
    )
    return () => window.clearTimeout(timer)
  }, [])

  const updateStat = (index: number, patch: Partial<StatDraft>) =>
    setStats((current) =>
      current.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
    )

  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setInvalidName(true)
      nameRef.current?.focus()
      return
    }

    onSave({
      id: existing?.id ?? nextId,
      name: name.trim().slice(0, 12),
      emoji: emoji.trim().slice(0, 8) || '🧑',
      position: position.trim().toUpperCase().slice(0, 5) || 'NOVO',
      shirtNumber: Math.min(99, Math.max(1, Math.round(Number(shirtNumber) || guests.length + 1))),
      overall: clamp(Number(overall) || 75),
      confirmed,
      brings: brings.trim().slice(0, 24) || '—',
      stats: stats.map((stat) => ({
        label: stat.label.trim().toUpperCase().slice(0, 8) || 'PONTOS',
        value: clamp(Number(stat.value) || 70),
      })) as [Attribute, Attribute, Attribute],
    })
    vib()
    onClose()
  }

  return (
    <Sheet
      title={state.kind === 'add' ? 'Novo convidado' : 'Editar convidado'}
      onClose={onClose}
    >
      {state.kind === 'pick' ? (
        <>
          <div className="act">
            {guests.map((guest) => (
              <button
                type="button"
                key={guest.id}
                className="btn ghost opt"
                onClick={() => {
                  vib()
                  onPick?.(guest.id)
                }}
              >
                {guest.emoji} {guest.name} — camisa {guest.shirtNumber}
              </button>
            ))}
          </div>
          <div className="bar">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={save}>
          <label htmlFor="gs-name">Nome</label>
          <input
            id="gs-name"
            ref={nameRef}
            type="text"
            maxLength={12}
            placeholder="Ex.: Prima Ana"
            value={name}
            className={invalidName ? 'invalid' : ''}
            onChange={(event) => {
              setName(event.target.value)
              if (event.target.value.trim()) setInvalidName(false)
            }}
          />

          <label htmlFor="gs-number">Número da camisa</label>
          <input
            id="gs-number"
            type="number"
            min={1}
            max={99}
            value={shirtNumber}
            onChange={(event) => setShirtNumber(event.target.value)}
          />

          <label htmlFor="gs-emoji">Emoji</label>
          <input
            id="gs-emoji"
            type="text"
            maxLength={8}
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
          />
          <div className="emoji-pick">
            {EMOJIS.map((option) => (
              <button
                type="button"
                key={option}
                aria-label={`Usar emoji ${option}`}
                onClick={() => {
                  setEmoji(option)
                  vib()
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="field-row">
            <div>
              <label htmlFor="gs-pos">Posição</label>
              <input
                id="gs-pos"
                type="text"
                maxLength={5}
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="gs-overall">Nota</label>
              <input
                id="gs-overall"
                type="number"
                min={0}
                max={99}
                value={overall}
                onChange={(event) => setOverall(event.target.value)}
              />
            </div>
          </div>

          <label>Atributos</label>
          {stats.map((stat, index) => (
            <div className="field-row" key={index}>
              <input
                type="text"
                aria-label={`Nome do atributo ${index + 1}`}
                maxLength={8}
                value={stat.label}
                onChange={(event) => updateStat(index, { label: event.target.value })}
              />
              <input
                type="number"
                aria-label={`Valor do atributo ${index + 1}`}
                min={0}
                max={99}
                value={stat.value}
                onChange={(event) => {
                  const value = event.target.valueAsNumber
                  updateStat(index, { value: Number.isFinite(value) ? value : '' })
                }}
              />
            </div>
          ))}

          <label htmlFor="gs-brings">Skill</label>
          <input
            id="gs-brings"
            type="text"
            maxLength={24}
            placeholder="Ex.: Bebidas"
            value={brings}
            onChange={(event) => setBrings(event.target.value)}
          />

          <label>Presença</label>
          <button
            type="button"
            className={`chip${confirmed ? ' on' : ''}`}
            onClick={() => {
              setConfirmed((value) => !value)
              vib()
            }}
          >
            {confirmed ? '✅ Confirmado' : '⏳ Pendente'}
          </button>

          <div className="bar">
            {state.kind === 'edit' && onDelete && (
              <button type="button" className="btn danger" onClick={onDelete}>
                🗑 Excluir
              </button>
            )}
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn">
              {state.kind === 'add' ? 'Adicionar' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </Sheet>
  )
}
