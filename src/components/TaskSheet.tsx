import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useChurrascoStore } from '../store/useChurrascoStore'
import { vib } from '../utils/vib'
import { GuestSheet } from './GuestSheet'
import { Sheet } from './Sheet'
import type { Task } from '../types'

interface TaskSheetProps {
  task?: Task
  onClose: () => void
  onSave: (title: string, workerId: number) => void
  onDelete?: () => void
}

export function TaskSheet({ task, onClose, onSave, onDelete }: TaskSheetProps) {
  const guests = useChurrascoStore((state) => state.guests)
  const nextId = useChurrascoStore((state) => state.nextId)
  const saveGuest = useChurrascoStore((state) => state.saveGuest)

  const [title, setTitle] = useState(task?.title ?? '')
  const [workerId, setWorkerId] = useState(task?.workerId ?? 0)
  const [invalidTitle, setInvalidTitle] = useState(false)
  const [guestSheetOpen, setGuestSheetOpen] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => titleRef.current?.focus(), 280)
    return () => window.clearTimeout(timer)
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) {
      setInvalidTitle(true)
      titleRef.current?.focus()
      return
    }
    onSave(title.trim().slice(0, 60), workerId)
    vib()
    onClose()
  }

  return (
    <>
      <Sheet title={task ? 'Editar tarefa' : 'Nova tarefa'} onClose={onClose}>
        <form onSubmit={submit}>
          <label htmlFor="ts-title">O que precisa ser feito?</label>
          <input
            id="ts-title"
            ref={titleRef}
            type="text"
            maxLength={60}
            placeholder="Ex.: Comprar pão de alho"
            value={title}
            className={invalidTitle ? 'invalid' : ''}
            onChange={(event) => {
              setTitle(event.target.value)
              if (event.target.value.trim()) setInvalidTitle(false)
            }}
          />

          <label>Quem vai fazer?</label>
          <div className="pick">
            <button
              type="button"
              className={`chip${workerId === 0 ? ' on' : ''}`}
              onClick={() => {
                setWorkerId(0)
                vib()
              }}
            >
              👤 Ninguém
            </button>
            {guests.map((guest) => (
              <button
                type="button"
                key={guest.id}
                className={`chip${workerId === guest.id ? ' on' : ''}`}
                onClick={() => {
                  setWorkerId(guest.id)
                  vib()
                }}
              >
                {guest.emoji} {guest.name}
              </button>
            ))}
            <button
              type="button"
              className="chip"
              onClick={() => {
                vib()
                setGuestSheetOpen(true)
              }}
            >
              ＋ Pessoa
            </button>
          </div>

          <div className="bar">
            {task && onDelete && (
              <button type="button" className="btn danger" onClick={onDelete}>
                🗑 Excluir
              </button>
            )}
            <button type="submit" className="btn">
              {task ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </Sheet>

      {guestSheetOpen && (
        <GuestSheet
          state={{ kind: 'add' }}
          guests={guests}
          nextId={nextId}
          onClose={() => setGuestSheetOpen(false)}
          onSave={(guest) => {
            saveGuest(guest)
            setWorkerId(guest.id)
          }}
        />
      )}
    </>
  )
}
