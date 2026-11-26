import { useToastStore } from '../store/useToastStore'

export function Toast() {
  const message = useToastStore((state) => state.message)
  const canUndo = useToastStore((state) => Boolean(state.snapshot))
  const hide = useToastStore((state) => state.hide)
  const undo = useToastStore((state) => state.undo)

  return (
    <div
      className={`toast${message ? ' on' : ''}`}
      role="status"
      aria-live="polite"
      onClick={(event) => {
        if (event.target === event.currentTarget) hide()
      }}
    >
      <span>{message}</span>
      {canUndo && (
        <button type="button" onClick={undo}>
          Desfazer
        </button>
      )}
    </div>
  )
}
