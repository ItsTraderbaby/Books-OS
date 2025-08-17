import React from 'react'
import { initialSections, seedBooks, uid, classNames, spineWidth } from './data'
import type { BookItem, Section, Chapter } from './types'

function TopBar({ q, setQ, zoom, setZoom, view, setView }: any){
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white grid place-items-center font-bold">BOS</div>
          <div>
            <div className="font-semibold leading-none">Books OS</div>
            <div className="text-xs text-zinc-500 leading-none">Your library is your operating system</div>
          </div>
        </div>
        <div className="flex-1"/>
        <div className="relative">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search books…" className="pl-3 pr-3 py-2 w-64 rounded-2xl border outline-none focus:ring-2 ring-zinc-300"/>
        </div>
        <div className="flex items-center gap-2 px-2">
          <button className="px-2 py-1 rounded-xl border" onClick={()=>setZoom((z:number)=>Math.max(0.5,z-0.1))}>-</button>
          <div className="text-xs w-12 text-center tabular-nums">{Math.round(zoom*100)}%</div>
          <button className="px-2 py-1 rounded-xl border" onClick={()=>setZoom((z:number)=>Math.min(1.6,z+0.1))}>+</button>
        </div>
        <div className="inline-flex rounded-2xl border overflow-hidden">
          <button onClick={()=>setView('wall')} className={classNames('px-3 py-2 text-sm', view==='wall'?'bg-zinc-900 text-white':'bg-white')}>Bookshelf</button>
          <button onClick={()=>setView('grid')} className={classNames('px-3 py-2 text-sm', view==='grid'?'bg-zinc-900 text-white':'bg-white')}>Grid</button>
        </div>
      </div>
    </div>
  )
}

function BookSpine({ book, onOpen, onDragStart }:{ book: BookItem; onOpen: (b:BookItem)=>void; onDragStart:(e:React.DragEvent,b:BookItem)=>void }){
  const w = book.meta?.kind === 'stack' ? 84 : spineWidth(book.title)
  const [dragging,setDragging] = React.useState(false)
  return (
    <div draggable onDragStart={(e)=>{ setDragging(true); onDragStart(e, book) }} onDragEnd={()=>setDragging(false)}
         className="relative select-none cursor-grab active:cursor-grabbing transform-gpu" style={{ width: w, height: 176, perspective: 800 }}
         onDoubleClick={()=>onOpen(book)} title={book.title}>
      {book.meta?.kind === 'stack' ? (
        <div className="relative h-full w-full">
          {[0,1,2].map(i=> (
            <div key={i} className={classNames('absolute h-full rounded-md shadow-md bg-gradient-to-b text-white border border-black/10', book.color || 'from-zinc-700 to-zinc-900')}
                 style={{ width: w - i*8, left: i*8, top: -i*2, transform: dragging?`rotateY(${10 - i*2}deg) translateY(-2px)`:`rotateY(${4 - i*1.5}deg)`, transition:'transform 120ms ease' }}>
              {i===2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-1 py-2 text-[10px] leading-tight tracking-wide uppercase bg-white/10 rounded-sm border border-white/20 rotate-180" style={{ writingMode:'vertical-rl' }}>
                    {book.title}
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 -top-[6px] h-[6px] bg-black/10 rounded-t-md"/>
              <div className="absolute inset-x-0 -bottom-[6px] h-[6px] bg-black/20 rounded-b-md"/>
            </div>
          ))}
        </div>
      ) : (
        <div className={classNames('group h-full w-full rounded-md shadow-md bg-gradient-to-b text-white border border-black/10', book.color || 'from-zinc-700 to-zinc-900')}
             style={{ transform: dragging?'rotateY(10deg) translateY(-2px)':'rotateY(0deg)', transition:'transform 120ms ease', transformStyle:'preserve-3d' }}>
          <div className="absolute inset-x-0 -top-[6px] h-[6px] bg-black/10 rounded-t-md"/>
          <div className="absolute inset-x-0 -bottom-[6px] h-[6px] bg-black/20 rounded-b-md"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-1 py-2 text-[10px] leading-tight tracking-wide uppercase bg-white/10 rounded-sm border border-white/20 rotate-180" style={{ writingMode:'vertical-rl' }}>
              {book.title}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ShelfRow({ section, books, onDropBook, onOpenBook, onDragStart }:{ section: Section; books: BookItem[]; onDropBook:(sectionId:string, bookId:string, beforeId?:string)=>void; onOpenBook:(b:BookItem)=>void; onDragStart:(e:React.DragEvent,b:BookItem)=>void }){
  const [hoverBefore, setHoverBefore] = React.useState<string | '__end__' | null>(null)
  const allowDrop = (e:React.DragEvent)=> e.preventDefault()
  const handleDropBetween = (e:React.DragEvent, beforeId?:string)=>{ e.preventDefault(); const bookId = e.dataTransfer.getData('text/bookId'); onDropBook(section.id, bookId, beforeId); setHoverBefore(null) }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div className={classNames('h-5 w-5 rounded-full bg-gradient-to-r', section.color)} />
        <div className="text-xs font-semibold tracking-wider text-zinc-700 uppercase bg-amber-100/70 border border-amber-300 rounded px-2 py-0.5 shadow-sm">{section.name}</div>
      </div>

      <div className="relative overflow-x-auto rounded-xl">
        <div className="relative min-w-full rounded-xl border border-amber-900/20 p-3 bg-gradient-to-b from-amber-200 to-amber-300 shadow-shelf">
          <div className="absolute left-0 right-0 bottom-0 h-3 rounded-b-xl bg-gradient-to-b from-black/5 to-black/20"/>
          <div className="relative flex items-end">
            <div onDragOver={(e)=>{allowDrop(e); setHoverBefore(books[0]?.id || '__end__')}} onDrop={(e)=>handleDropBetween(e, books[0]?.id)} className="w-2 h-[176px] mx-1">
              <div className={classNames('w-0.5 h-full mx-auto rounded', hoverBefore===(books[0]?.id||'__end__')?'bg-amber-900/60':'bg-transparent')}/>
            </div>
            {books.map((b, idx)=> (
              <React.Fragment key={b.id}>
                <BookSpine book={b} onOpen={onOpenBook} onDragStart={onDragStart}/>
                <div onDragOver={(e)=>{allowDrop(e); setHoverBefore(books[idx+1]?.id || '__end__')}} onDrop={(e)=>handleDropBetween(e, books[idx+1]?.id)} className="w-2 h-[176px] mx-1">
                  <div className={classNames('w-0.5 h-full mx-auto rounded', hoverBefore===(books[idx+1]?.id||'__end__')?'bg-amber-900/60':'bg-transparent')}/>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Drawer({ open, onClose, children }:{ open:boolean; onClose:()=>void; children: React.ReactNode }){
  return (
    <div className={classNames('fixed inset-0 z-50', open?'':'pointer-events-none')}> 
      <div className={classNames('absolute inset-0 bg-black/30 transition-opacity', open?'opacity-100':'opacity-0')} onClick={onClose}/>
      <div className={classNames('absolute right-0 top-0 h-full w-[420px] bg-white shadow-xl p-4 transition-transform', open?'translate-x-0':'translate-x-full')}>
        {children}
      </div>
    </div>
  )
}

function BookDrawer({ book, onClose, onUpdate }:{ book: BookItem | null; onClose:()=>void; onUpdate:(b:BookItem)=>void }){
  const [local, setLocal] = React.useState<BookItem | null>(book)
  React.useEffect(()=> setLocal(book), [book])
  if(!local) return null

  const moveChapter = (c: Chapter) => {
    const dest = prompt('Move chapter to which book title?')
    if(!dest) return
    onUpdate({ ...local, chapters: (local.chapters||[]).filter(ch=>ch.id!==c.id) })
    // In a real DB we would also append to the target book here
  }

  return (
    <Drawer open={!!local} onClose={onClose}>
      <div className="flex items-center gap-2 text-lg font-semibold mb-2">
        <span className="text-2xl">{local.emoji || '📘'}</span>
        {local.title}
      </div>
      <div className="grid gap-2">
        {(local.chapters||[]).map(c=> (
          <div key={c.id} className="p-2 border rounded-md bg-white shadow-sm flex justify-between items-center">
            <span>{c.title}</span>
            <button className="text-xs px-2 py-1 border rounded" onClick={()=>moveChapter(c)}>Move</button>
          </div>
        ))}
        <button className="px-3 py-2 border rounded" onClick={()=> setLocal({ ...local, chapters:[...(local.chapters||[]), { id: uid(), title:'New Chapter'} ] })}>+ Chapter</button>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-2 rounded bg-zinc-900 text-white" onClick={()=>{ onUpdate(local); onClose() }}>Save</button>
        <button className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
      </div>
    </Drawer>
  )
}

export default function BooksOS(){
  const [sections, setSections] = React.useState<Section[]>(initialSections)
  const [books, setBooks] = React.useState<BookItem[]>(seedBooks)
  const [zoom, setZoom] = React.useState(0.95)
  const [q, setQ] = React.useState('')
  const [openBook, setOpenBook] = React.useState<BookItem | null>(null)
  const [view, setView] = React.useState<'wall'|'grid'>('wall')

  React.useEffect(()=>{
    const s = localStorage.getItem('bos_sections'); const b = localStorage.getItem('bos_books')
    if(s) setSections(JSON.parse(s)); if(b) setBooks(JSON.parse(b))
  },[])
  React.useEffect(()=>{ localStorage.setItem('bos_sections', JSON.stringify(sections)); localStorage.setItem('bos_books', JSON.stringify(books)) }, [sections, books])

  const filtered = React.useMemo(()=>{
    const t = q.toLowerCase(); if(!t) return books
    return books.filter(b => (b.title + ' ' + (b.subtitle||'')).toLowerCase().includes(t))
  }, [books, q])

  const booksBySection = React.useMemo(()=>{
    const map: Record<string, BookItem[]> = {}
    for(const s of sections) map[s.id] = []
    for(const b of filtered){ if(!map[b.sectionId]) map[b.sectionId] = []; map[b.sectionId].push(b) }
    return map
  }, [filtered, sections])

  const onDragStart = (e:React.DragEvent, book:BookItem) => { e.dataTransfer.setData('text/bookId', book.id); e.dataTransfer.effectAllowed = 'move' }

  const onDropBook = (sectionId:string, bookId:string, beforeId?:string) => {
    setBooks(prev=>{
      const moved = prev.find(b=>b.id===bookId); if(!moved) return prev
      const without = prev.filter(b=>b.id!==bookId)
      const target = without.filter(b=>b.sectionId===sectionId)
      const other = without.filter(b=>b.sectionId!==sectionId)
      let idx = target.findIndex(b=>b.id===beforeId); if(idx<0) idx = target.length
      const updated = { ...moved, sectionId }
      const newTarget = [...target.slice(0,idx), updated, ...target.slice(idx)]
      return [...other, ...newTarget]
    })
  }

  const updateBook = (b:BookItem) => setBooks(prev=> prev.map(x=> x.id===b.id? b : x))

  return (
    <div className="min-h-screen">
      <TopBar q={q} setQ={setQ} zoom={zoom} setZoom={setZoom} view={view} setView={setView} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {view==='wall' ? (
          <div className="origin-top-left" style={{ transform: `scale(${zoom})` }}>
            {sections.slice().sort((a,b)=>a.order-b.order).map(s=> (
              <ShelfRow key={s.id} section={s} books={booksBySection[s.id]||[]} onDropBook={onDropBook} onOpenBook={(b)=>setOpenBook(b)} onDragStart={onDragStart}/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(b=> (
              <div key={b.id} className="p-3 bg-zinc-700 text-white rounded-md shadow-md cursor-pointer" onClick={()=>setOpenBook(b)}>
                <div className="font-semibold">{b.title}</div>
                <div className="text-xs opacity-80">{b.chapters?.length || 0} chapters</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookDrawer book={openBook} onClose={()=>setOpenBook(null)} onUpdate={updateBook}/>
      <div className="h-24"/>
    </div>
  )
}
