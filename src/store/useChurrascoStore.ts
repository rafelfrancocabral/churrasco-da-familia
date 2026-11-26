import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { boostStat, seed } from '../data/seed'
import type { ChurrascoData, Guest } from '../types'

interface ChurrascoStore extends ChurrascoData {
  setWhen: (when: string) => void
  saveGuest: (guest: Guest) => void
  removeGuest: (id: number) => void
  toggleGuest: (id: number) => void
  addTask: (title: string, workerId: number) => void
  updateTask: (id: number, title: string, workerId: number) => void
  removeTask: (id: number) => void
  toggleTask: (id: number) => void
  removeCompletedTasks: () => void
  resetTasks: () => void
  clearTasks: () => void
}

/** Dados puros, sem as ações, para snapshot de desfazer. */
export function pickData(state: ChurrascoData): ChurrascoData {
  return {
    tasks: state.tasks,
    guests: state.guests,
    when: state.when,
    nextId: state.nextId,
  }
}

/**
 * Migra dados salvos pela versão em HTML puro (chave antiga churrasco-v2),
 * se existirem. Sem isso, nada é perdido quando o usuário já usava a referência.
 */
function loadInitialData(): ChurrascoData {
  try {
    const raw = localStorage.getItem('churrasco-v2')
    if (!raw) return seed

    const old = JSON.parse(raw)
    if (!Array.isArray(old?.tasks) || !Array.isArray(old?.guests)) return seed

    return {
      tasks: old.tasks.map((task: Record<string, string | number | boolean>) => ({
        id: Number(task.id),
        title: String(task.t ?? ''),
        workerId: Number(task.w ?? 0),
        done: Boolean(task.d),
      })),
      guests: old.guests.map((guest: Record<string, unknown>) => ({
        id: Number(guest.id),
        name: String(guest.n ?? ''),
        emoji: String(guest.e ?? '🧑'),
        position: String(guest.p ?? 'NOVO'),
        overall: Number(guest.o ?? 75),
        confirmed: Boolean(guest.a),
        brings: String(guest.l ?? '—'),
        stats: (Array.isArray(guest.s) ? guest.s : []).map((stat: [string, number]) => ({
          label: String(stat[0] ?? 'PONTOS'),
          value: Number(stat[1] ?? 70),
        })) as Guest['stats'],
      })),
      when: String(old.when ?? seed.when),
      nextId: Number(old.nid ?? seed.nextId),
    }
  } catch {
    return seed
  }
}

export const useChurrascoStore = create<ChurrascoStore>()(
  persist<ChurrascoStore, [], [], ChurrascoData>(
    (set) => ({
      ...loadInitialData(),

      setWhen: (when) => set({ when }),

      saveGuest: (guest) =>
        set((state) => {
          const exists = state.guests.some((item) => item.id === guest.id)
          return {
            guests: exists
              ? state.guests.map((item) => (item.id === guest.id ? guest : item))
              : [...state.guests, guest],
            nextId: exists ? state.nextId : state.nextId + 1,
          }
        }),

      removeGuest: (id) =>
        set((state) => ({
          guests: state.guests.filter((guest) => guest.id !== id),
          // Tarefas órfãs voltam para "Ninguém".
          tasks: state.tasks.map((task) =>
            task.workerId === id ? { ...task, workerId: 0 } : task,
          ),
        })),

      toggleGuest: (id) =>
        set((state) => ({
          guests: state.guests.map((guest) =>
            guest.id === id ? { ...guest, confirmed: !guest.confirmed } : guest,
          ),
        })),

      addTask: (title, workerId) =>
        set((state) => ({
          tasks: [
            { id: state.nextId, title, workerId, done: false },
            ...state.tasks,
          ],
          nextId: state.nextId + 1,
        })),

      updateTask: (id, title, workerId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, title, workerId } : task,
          ),
        })),

      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task,
          ),
        })),

      removeCompletedTasks: () =>
        set((state) => ({ tasks: state.tasks.filter((task) => !task.done) })),

      resetTasks: () =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.done ? { ...task, done: false } : task)),
        })),

      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'churrasco-da-familia-v1',
      version: 2,
      migrate: (persisted, version) => {
        const data = persisted as ChurrascoData
        if (version >= 2 || !Array.isArray(data?.guests)) return data

        return {
          ...data,
          guests: data.guests.map((guest) => ({
            ...guest,
            overall: boostStat(guest.overall),
            stats: guest.stats.map((stat) => ({
              ...stat,
              value: boostStat(stat.value),
            })) as Guest['stats'],
          })),
        }
      },
    },
  ),
)
