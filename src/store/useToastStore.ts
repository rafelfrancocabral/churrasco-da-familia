import { create } from 'zustand'
import { pickData, useChurrascoStore } from './useChurrascoStore'

interface ToastStore {
  message: string | null
  snapshot: string | null
  show: (message: string, destructive?: boolean) => void
  hide: () => void
  undo: () => void
}

let timer: number | undefined

export const useToastStore = create<ToastStore>((set, get) => ({
  message: null,
  snapshot: null,

  show: (message, destructive = false) => {
    window.clearTimeout(timer)
    set({
      message,
      // Snapshot antes da ação destrutiva, para poder voltar exatamente como era.
      snapshot: destructive ? JSON.stringify(pickData(useChurrascoStore.getState())) : null,
    })
    timer = window.setTimeout(() => get().hide(), 4500)
  },

  hide: () => {
    window.clearTimeout(timer)
    set({ message: null, snapshot: null })
  },

  undo: () => {
    const { snapshot } = get()
    if (snapshot) useChurrascoStore.setState(JSON.parse(snapshot))
    get().hide()
  },
}))
