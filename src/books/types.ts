export type Chapter = { id: string; title: string; content?: string }
export type Section = { id: string; name: string; color: string; order: number }
export type BookItem = {
  id: string
  title: string
  subtitle?: string
  emoji?: string
  color?: string // gradient classes for spine
  sectionId: string
  chapters?: Chapter[]
  meta?: Record<string, any> // { kind?: 'stack' | 'normal' }
}
