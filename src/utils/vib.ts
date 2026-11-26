export function vib(duration = 12) {
  try {
    navigator.vibrate?.(duration)
  } catch {
    // Vibração é opcional em navegadores desktop.
  }
}
