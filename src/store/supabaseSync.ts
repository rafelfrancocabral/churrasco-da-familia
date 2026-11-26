import { supabase } from '../lib/supabase'
import type { ChurrascoData } from '../types'
import { pickData, useChurrascoStore } from './useChurrascoStore'

const ROW_ID = 1
const DEBOUNCE_MS = 300

/**
 * Sincroniza todo o estado do churrasco numa única linha do Supabase.
 * Last-write-wins: a última alteração salva vale para todos os dispositivos.
 */
export function startSupabaseSync(): () => void {
  if (!supabase) return () => {}
  const client = supabase

  let lastPushed = JSON.stringify(pickData(useChurrascoStore.getState()))
  let lastRemoteAt = 0
  let applyingRemote = false
  let pushTimer: number | undefined

  const push = async () => {
    const data = pickData(useChurrascoStore.getState())
    const json = JSON.stringify(data)
    if (json === lastPushed) return

    lastPushed = json
    const { error } = await client
      .from('churrasco_state')
      .upsert(
        { id: ROW_ID, data, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      )

    if (error) console.error('[sync] falha ao salvar no Supabase:', error.message)
  }

  const schedulePush = () => {
    window.clearTimeout(pushTimer)
    pushTimer = window.setTimeout(() => void push(), DEBOUNCE_MS)
  }

  const applyRemote = (data: ChurrascoData, updatedAt: string) => {
    const time = Date.parse(updatedAt)
    if (!Number.isFinite(time) || time <= lastRemoteAt) return
    lastRemoteAt = time

    const json = JSON.stringify(data)
    if (json === lastPushed) return

    applyingRemote = true
    useChurrascoStore.setState(data)
    lastPushed = json
    applyingRemote = false
  }

  const unsubscribe = useChurrascoStore.subscribe((state) => {
    if (applyingRemote) return
    if (JSON.stringify(pickData(state)) !== lastPushed) schedulePush()
  })

  const channel = client
    .channel('churrasco-state')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'churrasco_state',
        filter: `id=eq.${ROW_ID}`,
      },
      (payload) => {
        const row = payload.new as
          | { data: ChurrascoData; updated_at: string }
          | null
        if (row?.data) applyRemote(row.data, row.updated_at)
      },
    )
    .subscribe()

  void client
    .from('churrasco_state')
    .select('data, updated_at')
    .eq('id', ROW_ID)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) {
        console.error('[sync] falha ao carregar do Supabase:', error.message)
        return
      }
      if (!data) {
        void push()
        return
      }
      applyRemote(data.data as ChurrascoData, data.updated_at)
    })

  return () => {
    window.clearTimeout(pushTimer)
    unsubscribe()
    void client.removeChannel(channel)
  }
}
