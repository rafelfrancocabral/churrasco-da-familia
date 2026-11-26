export interface Attribute {
  label: string
  value: number
}

export interface Guest {
  id: number
  name: string
  emoji: string
  position: string
  overall: number
  confirmed: boolean
  brings: string
  stats: [Attribute, Attribute, Attribute]
}

export interface Task {
  id: number
  title: string
  workerId: number
  done: boolean
}

export interface ChurrascoData {
  tasks: Task[]
  guests: Guest[]
  when: string
  nextId: number
}

export type ViewId = 'home' | 'tasks' | 'guests'
