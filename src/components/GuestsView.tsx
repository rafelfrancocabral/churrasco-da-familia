import { useMemo, useState } from 'react'
import { GuestCard } from './GuestCard'
import { GuestSheet, type GuestSheetState } from './GuestSheet'
import { useChurrascoStore } from '../store/useChurrascoStore'
import { useToastStore } from '../store/useToastStore'
import { vib } from '../utils/vib'

/** Sorteio fixo por carregamento da página (troca apenas no refresh). */
const SHUFFLE_SEED = Math.random()

/** Embaralha com semente estável: a ordem não muda ao editar/confirmar cards. */
function shuffle<T>(items: T[], seed: number): T[] {
  const result = [...items]
  let state = Math.floor(seed * 2 ** 31) || 1
  const random = () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32
    return state / 2 ** 32
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function GuestsView() {
  const guests = useChurrascoStore((state) => state.guests)
  const nextId = useChurrascoStore((state) => state.nextId)
  const saveGuest = useChurrascoStore((state) => state.saveGuest)
  const removeGuest = useChurrascoStore((state) => state.removeGuest)
  const toggleGuest = useChurrascoStore((state) => state.toggleGuest)
  const showToast = useToastStore((state) => state.show)

  const [sheet, setSheet] = useState<GuestSheetState | null>(null)
  const confirmed = guests.filter((guest) => guest.confirmed).length
  const orderedGuests = useMemo(() => shuffle(guests, SHUFFLE_SEED), [guests])

  const deleteGuest = () => {
    if (sheet?.kind !== 'edit') return
    const guest = guests.find((item) => item.id === sheet.id)
    showToast(`${guest?.name ?? 'Convidado'} removido`, true)
    removeGuest(sheet.id)
    setSheet(null)
  }

  return (
    <section className="view on stage" id="v-guests">
      <div className="bar">
        <button
          type="button"
          className="btn"
          onClick={() => {
            vib()
            setSheet({ kind: 'add' })
          }}
        >
          ＋ Novo convidado
        </button>
        <button
          type="button"
          className="btn ghost"
          style={{ flex: 0.55 }}
          onClick={() => {
            vib()
            setSheet({ kind: 'pick' })
          }}
        >
          ✎ Editar
        </button>
      </div>

      <h2 style={{ marginTop: 4 }}>
        <span className="heading">
          <span className="title-icon" aria-hidden="true">
            👕
          </span>
          Escalação
        </span>
        <em>
          {confirmed} de {guests.length} confirmados
        </em>
      </h2>
      <div className="grid" id="guests">
        {orderedGuests.map((guest, index) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            index={index}
            onToggle={() => toggleGuest(guest.id)}
          />
        ))}
      </div>
      <div className="empty" style={{ padding: 14 }}>
        Toque na carta para confirmar ou tirar a presença
      </div>

      {sheet && (
        <GuestSheet
          key={sheet.kind === 'edit' ? `edit-${sheet.id}` : sheet.kind}
          state={sheet}
          guests={guests}
          nextId={nextId}
          onClose={() => setSheet(null)}
          onPick={(id) => setSheet({ kind: 'edit', id })}
          onSave={(guest) => {
            saveGuest(guest)
            showToast(sheet.kind === 'edit' ? 'Convidado atualizado' : 'Convidado adicionado')
          }}
          onDelete={sheet.kind === 'edit' ? deleteGuest : undefined}
        />
      )}
    </section>
  )
}
