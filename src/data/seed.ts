import type { ChurrascoData, Guest, Task } from '../types'

/** Valores de carta ficam na faixa FIFA (85–99). */
export const boostStat = (value: number) => Math.min(99, Math.max(85, value + 5))

/** Rótulos padrão — podem ser editados pelo usuário. */
export const STAT_LABELS = ['BEER', 'FOME', 'SOS'] as const

/** Rótulos das versões antigas que voltam ao padrão. */
const LEGACY_LABELS = new Set([
  'FOGO', 'PAPO', 'TEMPERO', 'AMOR', 'PIADA', 'GELO', 'FORÇA', 'DOCE', 'PONTOS',
])

/** Mantém três atributos, preservando rótulos personalizados. */
export function normalizeStats(stats: Guest['stats'] | undefined): Guest['stats'] {
  return STAT_LABELS.map((label, index) => {
    const stat = stats?.[index]
    const current = String(stat?.label ?? '').trim().toUpperCase()
    return {
      label: current && !LEGACY_LABELS.has(current) ? current.slice(0, 8) : label,
      value: Number(stat?.value ?? 70),
    }
  }) as Guest['stats']
}

export const EMOJIS = [
  '🧔', '👵', '🕶️', '👩', '🧒', '👧', '👨', '🧑‍🍳', '🤠', '😎',
  '🍺', '🇯🇵', '⚽', '🥸', '🍖', '🥩', '🧑‍⚕️',
]

const guests: Guest[] = [
  {
    id: 1,
    name: 'Pai',
    emoji: '🧔',
    position: 'CHURR',
    shirtNumber: 10,
    overall: 87,
    confirmed: true,
    brings: 'Carnes',
    stats: [
      { label: 'BEER', value: 92 },
      { label: 'FOME', value: 88 },
      { label: 'SOS', value: 80 },
    ],
  },
  {
    id: 2,
    name: 'Vó Lia',
    emoji: '👵',
    position: 'COZ',
    shirtNumber: 9,
    overall: 95,
    confirmed: true,
    brings: 'Farofa',
    stats: [
      { label: 'BEER', value: 99 },
      { label: 'FOME', value: 99 },
      { label: 'SOS', value: 70 },
    ],
  },
  {
    id: 3,
    name: 'Tio Zé',
    emoji: '🕶️',
    position: 'ATAC',
    shirtNumber: 7,
    overall: 82,
    confirmed: true,
    brings: 'Carvão',
    stats: [
      { label: 'BEER', value: 75 },
      { label: 'FOME', value: 95 },
      { label: 'SOS', value: 90 },
    ],
  },
  {
    id: 4,
    name: 'Mari',
    emoji: '👩',
    position: 'MEIA',
    shirtNumber: 8,
    overall: 78,
    confirmed: true,
    brings: 'Bebidas',
    stats: [
      { label: 'BEER', value: 85 },
      { label: 'FOME', value: 90 },
      { label: 'SOS', value: 65 },
    ],
  },
  {
    id: 5,
    name: 'Léo',
    emoji: '🧒',
    position: 'ZAG',
    shirtNumber: 11,
    overall: 70,
    confirmed: true,
    brings: 'Mesas',
    stats: [
      { label: 'BEER', value: 72 },
      { label: 'FOME', value: 96 },
      { label: 'SOS', value: 60 },
    ],
  },
  {
    id: 6,
    name: 'Bia',
    emoji: '👧',
    position: 'PAST',
    shirtNumber: 1,
    overall: 84,
    confirmed: true,
    brings: 'Sobremesa',
    stats: [
      { label: 'BEER', value: 94 },
      { label: 'FOME', value: 80 },
      { label: 'SOS', value: 78 },
    ],
  },
]

const tasks: Task[] = [
  { id: 1, title: 'Comprar carne e linguiça', workerId: 1, done: true },
  { id: 2, title: 'Comprar carvão e acendedor', workerId: 3, done: true },
  { id: 3, title: 'Bebidas e gelo', workerId: 4, done: false },
  { id: 4, title: 'Saladas e farofa', workerId: 2, done: false },
  { id: 5, title: 'Sobremesa', workerId: 6, done: false },
  { id: 6, title: 'Arrumar mesas e cadeiras', workerId: 5, done: false },
]

/** Próximo domingo às 13h, no fuso do celular ( igual à referência ). */
function nextSundayAt13h(): string {
  const date = new Date()
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7 || 7))
  date.setHours(13, 0, 0, 0)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

export const seed: ChurrascoData = {
  tasks,
  guests: guests.map((guest) => ({
    ...guest,
    overall: boostStat(guest.overall),
    stats: normalizeStats(guest.stats).map((stat) => ({
      ...stat,
      value: boostStat(stat.value),
    })) as Guest['stats'],
  })),
  when: nextSundayAt13h(),
  nextId: 100,
}
