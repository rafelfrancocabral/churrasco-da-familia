import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { GuestsView } from './components/GuestsView'
import { HomeView } from './components/HomeView'
import { TasksView } from './components/TasksView'
import { Toast } from './components/Toast'
import { useTilt } from './hooks/useTilt'
import { startSupabaseSync } from './store/supabaseSync'
import type { ViewId } from './types'

export default function App() {
  const [view, setView] = useState<ViewId>('home')
  useTilt()

  useEffect(() => startSupabaseSync(), [])

  return (
    <>
      <img className="logo" src="/logo.png" alt="Logo do churrasco" />
      <div className="sub">Deus, Pátria, Família, Brasil</div>

      {view === 'home' && <HomeView onSeeAll={() => setView('tasks')} />}
      {view === 'tasks' && <TasksView />}
      {view === 'guests' && <GuestsView />}

      <BottomNav active={view} onChange={setView} />
      <Toast />
    </>
  )
}
