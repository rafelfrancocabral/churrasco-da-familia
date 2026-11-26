import type { Guest, Task } from '../types'

interface TaskCardProps {
  task: Task
  worker?: Guest
  index?: number
  onToggle: () => void
  onEdit: () => void
}

export function TaskCard({ task, worker, index = 0, onToggle, onEdit }: TaskCardProps) {
  return (
    <div className={`task${task.done ? ' done' : ''}`} style={{ animationDelay: `${index * 40}ms` }}>
      <button
        type="button"
        className="coin"
        aria-label={task.done ? 'Reabrir tarefa' : 'Concluir tarefa'}
        aria-pressed={task.done}
        onClick={onToggle}
      >
        ✓
      </button>
      <div className="tx">
        <b>{task.title}</b>
        <small>{worker ? `Responsável: ${worker.name}` : 'Sem responsável'}</small>
      </div>
      <span className="who" aria-hidden="true">
        {worker?.emoji ?? '👤'}
      </span>
      <button type="button" className="ib" aria-label="Editar tarefa" onClick={onEdit}>
        ✎
      </button>
    </div>
  )
}
