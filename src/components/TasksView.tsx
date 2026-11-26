import { useState } from 'react'
import { ClearSheet } from './ClearSheet'
import { TaskCard } from './TaskCard'
import { TaskSheet } from './TaskSheet'
import { useChurrascoStore } from '../store/useChurrascoStore'
import { useToastStore } from '../store/useToastStore'
import { vib } from '../utils/vib'

const FILTERS: Array<[string, string]> = [
  ['all', 'Todas'],
  ['pend', 'Pendentes'],
  ['done', 'Feitas'],
]

export function TasksView() {
  const tasks = useChurrascoStore((state) => state.tasks)
  const guests = useChurrascoStore((state) => state.guests)
  const addTask = useChurrascoStore((state) => state.addTask)
  const updateTask = useChurrascoStore((state) => state.updateTask)
  const removeTask = useChurrascoStore((state) => state.removeTask)
  const toggleTask = useChurrascoStore((state) => state.toggleTask)
  const removeCompletedTasks = useChurrascoStore((state) => state.removeCompletedTasks)
  const resetTasks = useChurrascoStore((state) => state.resetTasks)
  const clearTasks = useChurrascoStore((state) => state.clearTasks)
  const showToast = useToastStore((state) => state.show)

  const [filter, setFilter] = useState('all')
  const [taskSheet, setTaskSheet] = useState<{ id?: number } | null>(null)
  const [clearOpen, setClearOpen] = useState(false)

  const visible = tasks.filter((task) => {
    if (filter === 'all') return true
    if (filter === 'pend') return !task.done
    if (filter === 'done') return task.done
    return filter === `p${task.workerId}`
  })

  const saveTask = (title: string, workerId: number) => {
    if (taskSheet?.id) {
      updateTask(taskSheet.id, title, workerId)
      showToast('Tarefa atualizada')
    } else {
      addTask(title, workerId)
      showToast('Tarefa criada')
    }
  }

  const deleteTask = () => {
    if (!taskSheet?.id) return
    showToast('Tarefa excluída', true)
    removeTask(taskSheet.id)
    setTaskSheet(null)
  }

  const clear = (message: string, action: () => void) => {
    showToast(message, true)
    action()
    setClearOpen(false)
    vib()
  }

  return (
    <section className="view on stage" id="v-tasks">
      <div className="bar">
        <button
          type="button"
          className="btn"
          onClick={() => {
            vib()
            setTaskSheet({})
          }}
        >
          ＋ Nova tarefa
        </button>
        <button
          type="button"
          className="btn ghost"
          style={{ flex: 0.55 }}
          onClick={() => {
            vib()
            setClearOpen(true)
          }}
        >
          🧹 Limpar
        </button>
      </div>

      <div className="chips">
        {FILTERS.map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={`chip${filter === value ? ' on' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
        {guests.map((guest) => (
          <button
            type="button"
            key={guest.id}
            className={`chip${filter === `p${guest.id}` ? ' on' : ''}`}
            onClick={() => setFilter(`p${guest.id}`)}
          >
            {guest.emoji} {guest.name}
          </button>
        ))}
      </div>

      <div id="list">
        {visible.length > 0 ? (
          visible.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              worker={guests.find((guest) => guest.id === task.workerId)}
              index={index}
              onToggle={() => {
                toggleTask(task.id)
                vib()
              }}
              onEdit={() => {
                vib()
                setTaskSheet({ id: task.id })
              }}
            />
          ))
        ) : (
          <div className="empty">
            <i>🥩</i>Nada por aqui. Crie uma tarefa!
          </div>
        )}
      </div>

      {taskSheet && (
        <TaskSheet
          key={taskSheet.id ?? 'new'}
          task={taskSheet.id ? tasks.find((task) => task.id === taskSheet.id) : undefined}
          onClose={() => setTaskSheet(null)}
          onSave={saveTask}
          onDelete={taskSheet.id ? deleteTask : undefined}
        />
      )}

      {clearOpen && (
        <ClearSheet
          onClose={() => setClearOpen(false)}
          onRemoveCompleted={() => clear('Concluídas removidas', removeCompletedTasks)}
          onReset={() => clear('Tarefas reabertas', resetTasks)}
          onClear={() => clear('Todas as tarefas apagadas', clearTasks)}
        />
      )}
    </section>
  )
}
