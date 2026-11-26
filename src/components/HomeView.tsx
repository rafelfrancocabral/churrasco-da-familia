import { TaskCard } from './TaskCard'
import { useCountdown } from '../hooks/useCountdown'
import { useChurrascoStore } from '../store/useChurrascoStore'
import { vib } from '../utils/vib'

const RING_LENGTH = 276.46
const COUNTDOWN_LABELS = ['dias', 'horas', 'min', 'seg']

interface HomeViewProps {
  onSeeAll: () => void
}

export function HomeView({ onSeeAll }: HomeViewProps) {
  const tasks = useChurrascoStore((state) => state.tasks)
  const guests = useChurrascoStore((state) => state.guests)
  const when = useChurrascoStore((state) => state.when)
  const setWhen = useChurrascoStore((state) => state.setWhen)
  const toggleTask = useChurrascoStore((state) => state.toggleTask)
  const countdown = useCountdown(when)
  const values = [
    countdown.days,
    countdown.hours,
    countdown.minutes,
    countdown.seconds,
  ].map((value) => String(value).padStart(2, '0'))

  const total = tasks.length
  const done = tasks.filter((task) => task.done).length
  const percent = total ? Math.round((done / total) * 100) : 0
  const confirmed = guests.filter((guest) => guest.confirmed).length
  const upcoming = tasks.filter((task) => !task.done).slice(0, 3)

  return (
    <section className="view on stage" id="v-home">
      <div className="glass hero tilt">
        <small>Faltam para o churrasco</small>
        <div className="cd" aria-live="off">
          {values.map((value, index) => (
            <div key={COUNTDOWN_LABELS[index]}>
              <b>{value}</b>
              <span>{COUNTDOWN_LABELS[index]}</span>
            </div>
          ))}
        </div>
        <input
          type="datetime-local"
          value={when}
          aria-label="Data do churrasco"
          onChange={(event) => setWhen(event.target.value)}
        />
      </div>

      <div className="row2">
        <div className="ring-cell tilt">
          <svg className="ring" viewBox="0 0 100 100" aria-label={`${percent}% das tarefas concluídas`}>
            <defs>
              <linearGradient id="g">
                <stop offset="0" stopColor="#ff5a2c" />
                <stop offset="1" stopColor="#ffc24a" />
              </linearGradient>
            </defs>
            <circle
              className="fg"
              cx="50"
              cy="50"
              r="44"
              transform="rotate(-90 50 50)"
              style={{ strokeDashoffset: RING_LENGTH * (1 - percent / 100) }}
            />
            <text x="50" y="50">
              {percent}%
            </text>
          </svg>
          <span>
            {done} de {total} tarefas
          </span>
        </div>
        <div className="glass mini tilt" style={{ display: 'grid', alignContent: 'center' }}>
          <b>{confirmed}</b>
          <span>confirmados</span>
        </div>
      </div>

      <h2>
        Próximas tarefas
        <em>
          <button type="button" className="link" onClick={onSeeAll}>
            ver todas →
          </button>
        </em>
      </h2>
      <div id="next">
        {upcoming.length > 0 ? (
          upcoming.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              worker={guests.find((guest) => guest.id === task.workerId)}
              index={index}
              onToggle={() => {
                toggleTask(task.id)
                vib()
              }}
              onEdit={onSeeAll}
            />
          ))
        ) : (
          <div className="empty">
            <i>🎉</i>Tudo pronto para o churrasco!
          </div>
        )}
      </div>
    </section>
  )
}
