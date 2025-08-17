import { BookItem, Section } from './types'

export const initialSections: Section[] = [
  { id: 'sec-contacts', name: 'Contacts', color: 'from-cyan-500 to-blue-500', order: 0 },
  { id: 'sec-projects', name: 'Projects', color: 'from-amber-500 to-red-500', order: 1 },
  { id: 'sec-games', name: 'Games', color: 'from-emerald-500 to-lime-500', order: 2 },
  { id: 'sec-ideas', name: 'Ideas', color: 'from-fuchsia-500 to-violet-500', order: 3 },
]

export const seedBooks: BookItem[] = [
  { id: 'b1', title: 'VIP Contacts', emoji: '👥', color: 'from-cyan-600 to-blue-700', sectionId: 'sec-contacts', chapters: [ { id: 'c1', title: 'Mom' }, { id: 'c2', title: 'CEO' } ] },
  { id: 'b2', title: 'Family', emoji: '🏡', color: 'from-sky-700 to-indigo-800', sectionId: 'sec-contacts', chapters: [ { id: 'c3', title: 'Birthday List' } ] },
  { id: 'b3', title: 'Camprnr.com', emoji: '🏕️', color: 'from-amber-600 to-orange-700', sectionId: 'sec-projects', chapters: [ { id: 'c4', title: 'MVP' } ] },
  { id: 'b4', title: 'AiFred & AiGents', emoji: '🤖', color: 'from-rose-600 to-red-700', sectionId: 'sec-projects', chapters: [ { id: 'c5', title: 'AI-TaaS' } ], meta: { kind: 'stack' } },
]

export const uid = () => Math.random().toString(36).slice(2,9)
export const classNames = (...cx: Array<string | false | null | undefined>) => cx.filter(Boolean).join(' ')
export const spineWidth = (title: string) => {
  const n = Array.from(title).reduce((a,c)=>a+c.charCodeAt(0),0)
  const widths = [40,44,48,52,56,60,64]
  return widths[n % widths.length]
}
