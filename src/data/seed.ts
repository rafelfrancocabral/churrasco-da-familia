import type { ChurrascoData, Guest, Task } from '../types'

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
    overall: 87,
    confirmed: true,
    brings: 'Carnes',
    stats: [
      { label: 'FOGO', value: 92 },
      { label: 'FOME', value: 88 },
      { label: 'PAPO', value: 80 },
    ],
  },
  {
    id: 2,
    name: 'Vó Lia',
    emoji: '👵',
    position: 'COZ',
    overall: 95,
    confirmed: true,
    brings: 'Farofa',
    stats: [
      { label: 'TEMPERO', value: 99 },
      { label: 'AMOR', value: 99 },
      { label: 'FOME', value: 70 },
    ],
  },
  {
    id: 3,
    name: 'Tio Zé',
    emoji: '🕶️',
    position: 'ATAC',
    overall: 82,
    confirmed: true,
    brings: 'Carvão',
    stats: [
      { label: 'FOGO', value: 75 },
      { label: 'PIADA', value: 95 },
      { label: 'FOME', value: 90 },
    ],
  },
  {
    id: 4,
    name: 'Mari',
    emoji: '👩',
    position: 'MEIA',
    overall: 78,
    confirmed: false,
    brings: 'Bebidas',
    stats: [
      { label: 'GELO', value: 85 },
      { label: 'PAPO', value: 90 },
      { label: 'FOME', value: 65 },
    ],
  },
  {
    id: 5,
    name: 'Léo',
    emoji: '🧒',
    position: 'ZAG',
    overall: 70,
    confirmed: true,
    brings: 'Mesas',
    stats: [
      { label: 'FORÇA', value: 72 },
      { label: 'FOME', value: 96 },
      { label: 'PAPO', value: 60 },
    ],
  },
  {
    id: 6,
    name: 'Bia',
    emoji: '👧',
    position: 'PAST',
    overall: 84,
    confirmed: false,
    brings: 'Sobremesa',
    stats: [
      { label: 'DOCE', value: 94 },
      { label: 'FOME', value: 80 },
      { label: 'PAPO', value: 78 },
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
  guests,
  when: nextSundayAt13h(),
  nextId: 100,
}
