import { Sheet } from './Sheet'

interface ClearSheetProps {
  onClose: () => void
  onRemoveCompleted: () => void
  onReset: () => void
  onClear: () => void
}

export function ClearSheet({ onClose, onRemoveCompleted, onReset, onClear }: ClearSheetProps) {
  return (
    <Sheet title="Limpar tarefas" onClose={onClose}>
      <div className="act">
        <button type="button" className="btn ghost" onClick={onRemoveCompleted}>
          ✔ Remover concluídas
        </button>
        <button type="button" className="btn ghost" onClick={onReset}>
          ↺ Desmarcar todas
        </button>
        <button type="button" className="btn danger" onClick={onClear}>
          🗑 Apagar todas
        </button>
      </div>
    </Sheet>
  )
}
