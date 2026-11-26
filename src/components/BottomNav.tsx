import type { ViewId } from '../types'

interface BottomNavProps {
  active: ViewId
  onChange: (view: ViewId) => void
}

const TABS: Array<{ id: ViewId; icon: string; label: string }> = [
  { id: 'home', icon: '🏠', label: 'Início' },
  { id: 'tasks', icon: '✅', label: 'Tarefas' },
  { id: 'guests', icon: '🃏', label: 'Escalação' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav aria-label="Navegação principal">
      {TABS.map((tab) => (
        <button
          type="button"
          key={tab.id}
          data-v={tab.id}
          className={active === tab.id ? 'on' : ''}
          aria-current={active === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
