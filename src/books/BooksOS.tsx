import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Heart } from 'lucide-react'
import { initialSections, seedProjects, uid, classNames, spineWidth } from './data'
import type { ProjectItem, Section, FileItem, TopBarProps, ViewMode, User, LibraryStats, Book } from './types'
import CommunityView from '../components/CommunityView'
import LibraryCard from '../components/LibraryCard'
import { SearchView } from '../components/SearchView'

function TopBar({ q, setQ, zoom, setZoom, view, setView, user, onSignOut }: TopBarProps){
  const searchRef = React.useRef<HTMLInputElement>(null)
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setQ('')
        searchRef.current?.blur()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setQ])

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-amber-200/50 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white grid place-items-center font-bold shadow-md">
            <Zap size={16} />
          </div>
          <div>
            <div className="font-bold text-zinc-800 leading-none">Books OS</div>
            <div className="text-xs text-zinc-600 leading-none">Your library is your operating system</div>
          </div>
        </motion.div>
        
        <div className="flex-1"/>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            ref={searchRef}
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Search books… (⌘K)" 
            className="pl-10 pr-4 py-2.5 w-72 rounded-2xl border border-amber-200 bg-white/80 outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
          />
          {q && (
            <button 
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-amber-50 border border-amber-200">
          <button 
            className="px-2 py-1 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 transition-colors" 
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          >
            −
          </button>
          <div className="text-sm w-12 text-center tabular-nums font-medium text-amber-800">
            {Math.round(zoom * 100)}%
          </div>
          <button 
            className="px-2 py-1 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 transition-colors" 
            onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
          >
            +
          </button>
        </div>
        
        <div className="inline-flex rounded-2xl border border-amber-200 overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setView('library3d')} 
            className={classNames(
              'px-4 py-2.5 text-sm font-medium transition-all',
              view === 'library3d' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-zinc-700 hover:bg-amber-50'
            )}
          >
            3D Library
          </button>
          <button 
            onClick={() => setView('wall')} 
            className={classNames(
              'px-4 py-2.5 text-sm font-medium transition-all',
              view === 'wall' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-zinc-700 hover:bg-amber-50'
            )}
          >
            Shelves
          </button>
          <button 
            onClick={() => setView('grid')} 
            className={classNames(
              'px-4 py-2.5 text-sm font-medium transition-all',
              view === 'grid' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-zinc-700 hover:bg-amber-50'
            )}
          >
            Grid
          </button>
          <button 
            onClick={() => setView('search')} 
            className={classNames(
              'px-4 py-2.5 text-sm font-medium transition-all',
              view === 'search' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-zinc-700 hover:bg-amber-50'
            )}
          >
            Search
          </button>
          <button 
            onClick={() => setView('community')} 
            className={classNames(
              'px-4 py-2.5 text-sm font-medium transition-all',
              view === 'community' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-zinc-700 hover:bg-amber-50'
            )}
          >
            Community
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 grid place-items-center text-white font-bold text-xs">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <span className="font-medium">{user?.displayName}</span>
          </div>
          <button
            onClick={onSignOut}
            className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// 3D Library Components
function ShelfEnd({ section, projectCount, isSelected, onClick }: {
  section: Section
  projectCount: number
  isSelected: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ 
        width: 140, 
        height: 220, 
        perspective: 1000 
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      animate={{
        z: isSelected ? 60 : 0,
        rotateY: isSelected ? -20 : isHovered ? -5 : 0,
        scale: isSelected ? 1.15 : isHovered ? 1.05 : 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Main Shelf End */}
      <div 
        className={`absolute inset-0 rounded-lg shadow-xl bg-gradient-to-b ${section.color} border border-black/20`}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Wood grain texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-black/30 rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-lg" />
        
        {/* Section Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <motion.div 
            className="h-10 w-10 rounded-full bg-white/25 mb-4 flex items-center justify-center backdrop-blur-sm border border-white/30"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`h-5 w-5 rounded-full bg-gradient-to-r ${section.color} shadow-sm`} />
          </motion.div>
          <div className="text-center">
            <div className="font-bold text-base mb-2 tracking-wide uppercase drop-shadow-sm">
              {section.name}
            </div>
            <div className="text-xs opacity-90 bg-black/20 px-2 py-1 rounded-full">
              {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </div>
          </div>
        </div>

        {/* 3D Depth Sides */}
        <div 
          className="absolute top-0 right-0 w-3 h-full bg-black/30 rounded-r-lg"
          style={{
            transform: 'rotateY(90deg) translateZ(1.5px)',
            transformOrigin: 'left center',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-3 bg-black/30 rounded-b-lg"
          style={{
            transform: 'rotateX(90deg) translateZ(1.5px)',
            transformOrigin: 'top center',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
          }}
        />
      </div>

      {/* Hover glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-lg bg-white/20 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute -inset-2 rounded-xl border-2 border-amber-400 bg-amber-400/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

function Library3DView({ 
  sections, 
  projectsBySection, 
  selectedShelf, 
  onSelectShelf, 
  onOpenProject, 
  onDragStart 
}: {
  sections: Section[]
  projectsBySection: Record<string, ProjectItem[]>
  selectedShelf: string | null
  onSelectShelf: (sectionId: string | null) => void
  onOpenProject: (project: ProjectItem) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, project: ProjectItem) => void
}) {
  const selectedSection = sections.find(s => s.id === selectedShelf)

  return (
    <div className="min-h-[700px] bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-xl overflow-hidden relative">
      {/* Library Atmosphere */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-100/30 to-amber-200/50" />
      
      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-yellow-200/20 to-transparent rounded-full blur-3xl" />
      
      {/* Library Floor with perspective */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-300/40 to-transparent"
        style={{
          transform: 'rotateX(85deg) translateZ(-50px)',
          transformOrigin: 'bottom center'
        }}
      />

      {!selectedShelf ? (
        // Shelf Ends View - Library Aisle
        <motion.div 
          className="flex items-center justify-center min-h-[700px] p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            {/* Library aisle perspective */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-5xl">
              {sections.slice().sort((a, b) => a.order - b.order).map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 50, rotateY: -30 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <ShelfEnd
                    section={section}
                    projectCount={projectsBySection[section.id]?.length || 0}
                    isSelected={false}
                    onClick={() => onSelectShelf(section.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Keyboard hints */}
            <motion.div 
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-xs text-amber-700/70 bg-white/60 px-3 py-2 rounded-lg backdrop-blur-sm border border-amber-200">
                Press 1-6 to quickly select a shelf, or click to explore
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        // Selected Shelf View
        <motion.div 
          className="p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          {/* Back Button */}
          <motion.button
            onClick={() => {
              console.log('Back button clicked, returning to library aisle')
              onSelectShelf(null)
            }}
            className="mb-6 px-4 py-2.5 bg-white/90 hover:bg-white rounded-lg shadow-md border border-amber-200 hover:border-amber-300 transition-all flex items-center gap-3 font-medium text-zinc-700 hover:text-zinc-900 hover:shadow-lg cursor-pointer z-10 relative group active:bg-amber-50"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              // Subtle pulse to draw attention
              boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "0 4px 6px -1px rgba(245, 158, 11, 0.2)",
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              ]
            }}
            transition={{ 
              delay: 0.3,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            <motion.span 
              className="text-amber-600 group-hover:text-amber-700 transition-colors"
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              ←
            </motion.span> 
            <span>Back to Library</span>
            <span className="text-xs text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border group-hover:bg-zinc-200">ESC</span>
          </motion.button>

          {/* Shelf Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${selectedSection?.color}`} />
            <div>
              <h2 className="text-2xl font-bold text-zinc-800">{selectedSection?.name}</h2>
              <p className="text-zinc-600">{selectedSection?.description}</p>
            </div>
          </div>

          {/* 3D Shelf with Books */}
          <div className="relative" style={{ perspective: 1200 }}>
            <motion.div
              className="relative bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-6 shadow-shelf"
              style={{
                transformStyle: 'preserve-3d',
                minHeight: 220
              }}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Shelf Back Wall */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-400 rounded-xl"
                style={{
                  transform: 'translateZ(-20px)',
                  transformStyle: 'preserve-3d'
                }}
              />

              {/* Shelf Bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-xl"
                style={{
                  transform: 'rotateX(90deg)',
                  transformOrigin: 'bottom center'
                }}
              />

              {/* Projects on Shelf */}
              <div className="relative flex items-end gap-2 min-h-[180px] pt-4">
                {projectsBySection[selectedShelf]?.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-amber-800/60 italic">
                    No projects in this section yet
                  </div>
                ) : (
                  projectsBySection[selectedShelf]?.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20, rotateY: -30 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                    >
                      <ProjectSpine 
                        project={project} 
                        onOpen={onOpenProject} 
                        onDragStart={onDragStart}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function ProjectSpine({ project, onOpen, onDragStart }: { 
  project: ProjectItem
  onOpen: (p: ProjectItem) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, p: ProjectItem) => void 
}) {
  const w = project.meta?.kind === 'stack' ? 84 : spineWidth(project.title)
  const [dragging, setDragging] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  
  const getProjectTypeIcon = () => {
    switch (project.meta?.projectType) {
      case 'repository': return '📦'
      case 'documentation': return '📚'
      case 'collection': return '📁'
      case 'template': return '📋'
      case 'workflow': return '⚙️'
      case 'archive': return '🗃️'
      default: return project.emoji || '📄'
    }
  }
  
  return (
    <div 
      draggable 
      onDragStart={(e) => { setDragging(true); onDragStart(e, project) }} 
      onDragEnd={() => setDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative select-none cursor-grab active:cursor-grabbing transform-gpu" 
      style={{ 
        width: w, 
        height: 176, 
        perspective: 800,
        transform: `scale(${isHovered ? 1.02 : 1}) translateY(${dragging ? -4 : isHovered ? -2 : 0}px) rotateY(${dragging ? 15 : isHovered ? 5 : 0}deg)`,
        transition: 'transform 0.2s ease'
      }}
      onDoubleClick={() => onOpen(project)} 
      title={`${project.title}${project.subtitle ? ` - ${project.subtitle}` : ''} (${project.files?.length || 0} files) - ${project.meta?.projectType || 'project'}`}
    >
      {project.meta?.kind === 'stack' ? (
        <div className="relative h-full w-full">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i} 
              className={classNames(
                'absolute h-full rounded-md shadow-lg bg-gradient-to-b text-white border border-black/10', 
                project.color || 'from-zinc-700 to-zinc-900'
              )}
              style={{ 
                width: w - i * 8, 
                left: i * 8, 
                top: -i * 2,
                transformStyle: 'preserve-3d'
              }}
              animate={{
                rotateY: dragging ? (10 - i * 2) : isHovered ? (4 - i * 1.5) : (2 - i),
                translateY: dragging ? -2 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {i === 2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-1 py-2 text-[10px] leading-tight tracking-wide uppercase bg-white/15 rounded-sm border border-white/25 rotate-180 backdrop-blur-sm" 
                       style={{ writingMode: 'vertical-rl' }}>
                    {project.title}
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 -top-[6px] h-[6px] bg-black/15 rounded-t-md"/>
              <div className="absolute inset-x-0 -bottom-[6px] h-[6px] bg-black/25 rounded-b-md"/>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className={classNames(
            'group h-full w-full rounded-md shadow-lg bg-gradient-to-b text-white border border-black/10', 
            project.color || 'from-zinc-700 to-zinc-900'
          )}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateY: dragging ? 12 : isHovered ? 6 : 0,
            translateY: dragging ? -3 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="absolute inset-x-0 -top-[6px] h-[6px] bg-black/15 rounded-t-md"/>
          <div className="absolute inset-x-0 -bottom-[6px] h-[6px] bg-black/25 rounded-b-md"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-1 py-2 text-[10px] leading-tight tracking-wide uppercase bg-white/15 rounded-sm border border-white/25 rotate-180 backdrop-blur-sm" 
                 style={{ writingMode: 'vertical-rl' }}>
              {project.title}
            </div>
          </div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-lg opacity-90">
            {getProjectTypeIcon()}
          </div>
          {project.files && project.files.length > 0 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] bg-white/20 px-1 rounded text-center">
              {project.files.length}
            </div>
          )}
          {project.meta?.language && (
            <div className="absolute bottom-2 right-1 text-[6px] bg-white/30 px-1 rounded opacity-70">
              {project.meta.language.slice(0, 3).toUpperCase()}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

function ShelfRow({ section, projects, onDropProject, onOpenProject, onDragStart }: { 
  section: Section
  projects: ProjectItem[]
  onDropProject: (sectionId: string, projectId: string, beforeId?: string) => void
  onOpenProject: (p: ProjectItem) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, p: ProjectItem) => void 
}) {
  const [hoverBefore, setHoverBefore] = React.useState<string | '__end__' | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  
  const allowDrop = (e: React.DragEvent) => e.preventDefault()
  
  const handleDropBetween = (e: React.DragEvent, beforeId?: string) => { 
    e.preventDefault()
    const projectId = e.dataTransfer.getData('text/projectId')
    onDropProject(section.id, projectId, beforeId)
    setHoverBefore(null)
    setIsDragOver(false)
  }

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div 
          className={classNames('h-6 w-6 rounded-full bg-gradient-to-r shadow-sm', section.color)}
          whileHover={{ scale: 1.1 }}
        />
        <div className="text-sm font-bold tracking-wider text-zinc-800 uppercase bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-lg px-3 py-1.5 shadow-sm">
          {section.name}
        </div>
        <div className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </div>
      </div>

      <motion.div 
        className="relative overflow-x-auto rounded-xl"
        animate={{ scale: isDragOver ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative min-w-full rounded-xl border-2 border-amber-900/20 p-4 bg-gradient-to-b from-amber-200 via-amber-250 to-amber-300 shadow-shelf">
          {/* Enhanced shelf lighting */}
          <div className="absolute left-0 right-0 top-0 h-2 rounded-t-xl bg-gradient-to-b from-white/40 to-transparent"/>
          <div className="absolute left-0 right-0 bottom-0 h-4 rounded-b-xl bg-gradient-to-b from-black/5 to-black/25"/>
          
          <div className="relative flex items-end min-h-[176px]">
            {/* First drop zone */}
            <motion.div 
              onDragOver={(e) => { allowDrop(e); setHoverBefore(projects[0]?.id || '__end__'); setIsDragOver(true) }} 
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => handleDropBetween(e, projects[0]?.id)} 
              className="w-3 h-[176px] mx-1 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className={classNames(
                  'w-1 h-full mx-auto rounded-full transition-all duration-200',
                  hoverBefore === (projects[0]?.id || '__end__') 
                    ? 'bg-amber-900/80 shadow-lg' 
                    : 'bg-transparent hover:bg-amber-900/30'
                )}
                animate={{ 
                  scaleY: hoverBefore === (projects[0]?.id || '__end__') ? 1.1 : 1,
                  opacity: hoverBefore === (projects[0]?.id || '__end__') ? 1 : 0.3
                }}
              />
            </motion.div>
            
            {/* Projects with drop zones */}
            <AnimatePresence>
              {projects.map((p, idx) => (
                <React.Fragment key={p.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ProjectSpine project={p} onOpen={onOpenProject} onDragStart={onDragStart}/>
                  </motion.div>
                  
                  <motion.div 
                    onDragOver={(e) => { allowDrop(e); setHoverBefore(projects[idx + 1]?.id || '__end__'); setIsDragOver(true) }} 
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => handleDropBetween(e, projects[idx + 1]?.id)} 
                    className="w-3 h-[176px] mx-1 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className={classNames(
                        'w-1 h-full mx-auto rounded-full transition-all duration-200',
                        hoverBefore === (projects[idx + 1]?.id || '__end__') 
                          ? 'bg-amber-900/80 shadow-lg' 
                          : 'bg-transparent hover:bg-amber-900/30'
                      )}
                      animate={{ 
                        scaleY: hoverBefore === (projects[idx + 1]?.id || '__end__') ? 1.1 : 1,
                        opacity: hoverBefore === (projects[idx + 1]?.id || '__end__') ? 1 : 0.3
                      }}
                    />
                  </motion.div>
                </React.Fragment>
              ))}
            </AnimatePresence>
            
            {/* Empty shelf message */}
            {projects.length === 0 && (
              <motion.div 
                className="flex-1 flex items-center justify-center h-[176px] text-amber-800/60 text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Drop projects here to organize your {section.name.toLowerCase()}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Drawer({ open, onClose, children }: { 
  open: boolean
  onClose: () => void
  children: React.ReactNode 
}) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50"> 
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div 
            className="absolute right-0 top-0 h-full w-[480px] bg-white shadow-2xl border-l border-amber-200"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ProjectDrawer({ project, onClose, onUpdate, user }: { 
  project: ProjectItem | null
  onClose: () => void
  onUpdate: (p: ProjectItem) => void
  user: User
}) {
  const [local, setLocal] = React.useState<ProjectItem | null>(project)
  React.useEffect(() => setLocal(project), [project])
  if (!local) return null

  const moveFile = (f: FileItem) => {
    const dest = prompt('Move file to which project title?')
    if (!dest) return
    onUpdate({ ...local, files: (local.files || []).filter((file: FileItem) => file.id !== f.id) })
    // In a real DB we would also append to the target project here
  }

  const getFileTypeIcon = (fileType: FileItem['fileType']) => {
    switch (fileType) {
      case 'code': return '💻'
      case 'markdown': return '📝'
      case 'image': return '🖼️'
      case 'document': return '📄'
      case 'link': return '🔗'
      case 'text': return '📃'
      default: return '📁'
    }
  }

  return (
    <Drawer open={!!local} onClose={onClose}>
      <div className="flex items-center gap-3 text-lg font-semibold mb-4">
        <span className="text-2xl">{local.emoji || '📦'}</span>
        <div>
          <div>{local.title}</div>
          {local.subtitle && <div className="text-sm text-zinc-600 font-normal">{local.subtitle}</div>}
        </div>
      </div>
      
      {local.meta && (
        <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {local.meta.projectType && (
              <div><span className="text-zinc-500">Type:</span> {local.meta.projectType}</div>
            )}
            {local.meta.language && (
              <div><span className="text-zinc-500">Language:</span> {local.meta.language}</div>
            )}
            {local.meta.status && (
              <div><span className="text-zinc-500">Status:</span> {local.meta.status}</div>
            )}
            {local.forks !== undefined && (
              <div><span className="text-zinc-500">Forks:</span> {local.forks}</div>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Files ({local.files?.length || 0})</h3>
        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {(local.files || []).map((f: FileItem) => (
            <div key={f.id} className="p-2 border rounded-md bg-white shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFileTypeIcon(f.fileType)}</span>
                <div>
                  <div className="font-medium">{f.title}</div>
                  <div className="text-xs text-zinc-500">{f.fileType}{f.extension && ` • ${f.extension}`}</div>
                </div>
              </div>
              <button className="text-xs px-2 py-1 border rounded hover:bg-zinc-50" onClick={() => moveFile(f)}>
                Move
              </button>
            </div>
          ))}
        </div>
        <button 
          className="mt-2 px-3 py-2 border rounded-lg hover:bg-zinc-50 w-full text-left" 
          onClick={() => setLocal({ 
            ...local, 
            files: [...(local.files || []), { 
              id: uid(), 
              title: 'New File',
              fileType: 'text',
              authorId: user.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              isPublic: false
            }] 
          })}
        >
          + Add File
        </button>
      </div>
      
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700" 
          onClick={() => { onUpdate(local); onClose() }}
        >
          Save Changes
        </button>
        <button 
          className="px-4 py-2 rounded-lg border hover:bg-zinc-50" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Drawer>
  )
}

type BooksOSProps = {
  user: User
  onSignOut: () => void
}

export default function BooksOS({ user, onSignOut }: BooksOSProps){
  const [sections, setSections] = React.useState<Section[]>(initialSections)
  const [projects, setProjects] = React.useState<ProjectItem[]>(seedProjects)
  const [zoom, setZoom] = React.useState(0.95)
  const [q, setQ] = React.useState('')
  const [openProject, setOpenProject] = React.useState<ProjectItem | null>(null)
  const [view, setView] = React.useState<ViewMode>('library3d')
  const [selectedShelf, setSelectedShelf] = React.useState<string | null>(null)

  // Initialize with user-specific data
  React.useEffect(() => {
    const userKey = `bos_${user.id}`
    const s = localStorage.getItem(`${userKey}_sections`)
    const p = localStorage.getItem(`${userKey}_projects`)
    
    if (s) setSections(JSON.parse(s))
    if (p) {
      const userProjects = JSON.parse(p).map((project: ProjectItem) => ({
        ...project,
        ownerId: user.id,
        ownerName: user.displayName
      }))
      setProjects(userProjects)
    } else {
      // Initialize with sample projects for new users
      const initialProjects = seedProjects.map(project => ({
        ...project,
        ownerId: user.id,
        ownerName: user.displayName,
        isPublic: false,
        likes: 0,
        forks: 0,
        meta: {
          ...project.meta,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }))
      setProjects(initialProjects)
    }
  }, [user])

  React.useEffect(() => {
    const userKey = `bos_${user.id}`
    localStorage.setItem(`${userKey}_sections`, JSON.stringify(sections))
    localStorage.setItem(`${userKey}_projects`, JSON.stringify(projects))
  }, [sections, projects, user.id])

  const filtered = React.useMemo(() => {
    const t = q.toLowerCase()
    if (!t) return projects
    return projects.filter(p => (p.title + ' ' + (p.subtitle || '')).toLowerCase().includes(t))
  }, [projects, q])

  const projectsBySection = React.useMemo(() => {
    const map: Record<string, ProjectItem[]> = {}
    for (const s of sections) map[s.id] = []
    for (const p of filtered) { 
      if (!map[p.sectionId]) map[p.sectionId] = []
      map[p.sectionId].push(p) 
    }
    return map
  }, [filtered, sections])

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, project: ProjectItem) => { 
    e.dataTransfer.setData('text/projectId', project.id)
    e.dataTransfer.effectAllowed = 'move' 
  }

  const onDropProject = (sectionId: string, projectId: string, beforeId?: string) => {
    setProjects(prev => {
      const moved = prev.find(p => p.id === projectId)
      if (!moved) return prev
      const without = prev.filter(p => p.id !== projectId)
      const target = without.filter(p => p.sectionId === sectionId)
      const other = without.filter(p => p.sectionId !== sectionId)
      let idx = target.findIndex(p => p.id === beforeId)
      if (idx < 0) idx = target.length
      const updated = { ...moved, sectionId }
      const newTarget = [...target.slice(0, idx), updated, ...target.slice(idx)]
      return [...other, ...newTarget]
    })
  }

  const updateProject = (p: ProjectItem) => setProjects(prev => prev.map(x => x.id === p.id ? p : x))

  const likeProject = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const likedBy = project.likedBy || []
        const isLiked = likedBy.includes(user.id)
        return {
          ...project,
          likes: isLiked ? (project.likes || 1) - 1 : (project.likes || 0) + 1,
          likedBy: isLiked 
            ? likedBy.filter((id: string) => id !== user.id)
            : [...likedBy, user.id]
        }
      }
      return project
    }))
  }

  const forkProject = (communityProject: ProjectItem) => {
    const newProject: ProjectItem = {
      ...communityProject,
      id: uid(),
      ownerId: user.id,
      ownerName: user.displayName,
      isPublic: false,
      likes: 0,
      likedBy: [],
      forks: 0,
      forkedFrom: communityProject.id,
      meta: {
        ...communityProject.meta,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    setProjects(prev => [...prev, newProject])
    
    // Increment fork count on original
    setProjects(prev => prev.map(p => 
      p.id === communityProject.id 
        ? { ...p, forks: (p.forks || 0) + 1 }
        : p
    ))
  }

  const toggleProjectPublic = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isPublic: !project.isPublic }
        : project
    ))
  }

  // Mock library stats (in real app, this would come from API)
  const libraryStats: LibraryStats = React.useMemo(() => ({
    totalProjects: projects.length,
    totalUsers: 1247, // Mock data
    totalSections: sections.length,
    projectsAddedToday: 23, // Mock data
    activeUsers: 89, // Mock data
    totalFiles: projects.reduce((acc, p) => acc + (p.files?.length || 0), 0),
    totalForks: projects.reduce((acc, p) => acc + (p.forks || 0), 0)
  }), [projects])

  // Keyboard navigation for 3D library
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && view === 'library3d' && selectedShelf) {
        setSelectedShelf(null)
      }
      // Number keys to quickly select shelves in 3D view
      if (view === 'library3d' && !selectedShelf && e.key >= '1' && e.key <= '6') {
        const index = parseInt(e.key) - 1
        const section = sections.slice().sort((a: Section, b: Section) => a.order - b.order)[index]
        if (section) {
          setSelectedShelf(section.id)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [view, selectedShelf, sections])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-red-50/30">
      <TopBar 
        q={q} 
        setQ={setQ} 
        zoom={zoom} 
        setZoom={setZoom} 
        view={view} 
        setView={setView} 
        user={user}
        onSignOut={onSignOut}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === 'library3d' ? (
          <Library3DView
            sections={sections}
            projectsBySection={projectsBySection}
            selectedShelf={selectedShelf}
            onSelectShelf={setSelectedShelf}
            onOpenProject={(p) => setOpenProject(p)}
            onDragStart={onDragStart}
          />
        ) : view === 'search' ? (
          <SearchView
            books={projects as Book[]}
            user={user}
            searchQuery={q}
            onSearchQueryChange={setQ}
            onOpenBook={(book) => setOpenProject(book as ProjectItem)}
          />
        ) : view === 'community' ? (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <LibraryCard user={user} stats={libraryStats} />
              <div className="mt-6 bg-white rounded-xl border border-amber-200 p-4">
                <h3 className="font-semibold text-zinc-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-sm">
                    Create New Project
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-sm">
                    Import from GitHub
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-sm">
                    Browse Templates
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <CommunityView 
                projects={projects} 
                sections={sections} 
                user={user}
                onLikeProject={likeProject}
                onForkProject={forkProject}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-zinc-800">My Library</h1>
                <p className="text-zinc-600">Welcome back, {user.displayName}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                  New Project
                </button>
              </div>
            </div>

            {view === 'wall' ? (
              <div className="origin-top-left" style={{ transform: `scale(${zoom})` }}>
                {sections.slice().sort((a,b) => a.order - b.order).map(s => (
                  <ShelfRow 
                    key={s.id} 
                    section={s} 
                    projects={projectsBySection[s.id] || []} 
                    onDropProject={onDropProject} 
                    onOpenProject={(p) => setOpenProject(p)} 
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <motion.div 
                    key={p.id} 
                    className="bg-white border border-amber-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => setOpenProject(p)}
                    whileHover={{ y: -2 }}
                  >
                    <div className={`h-24 bg-gradient-to-br ${p.color || 'from-zinc-600 to-zinc-800'} p-3 text-white relative`}>
                      <div className="text-xl mb-1">{p.emoji || '📦'}</div>
                      <div className="font-semibold text-sm leading-tight">{p.title}</div>
                      {p.meta?.language && (
                        <div className="absolute top-2 right-2 text-xs bg-white/20 px-1 rounded">
                          {p.meta.language.slice(0, 3).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-zinc-600 mb-2">
                        {p.files?.length || 0} files • {p.meta?.projectType || 'project'}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Heart size={12} className={p.isPublic ? 'text-red-500' : 'text-zinc-400'} />
                          <span className="text-xs text-zinc-500">{p.isPublic ? 'Public' : 'Private'}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProjectPublic(p.id)
                          }}
                          className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                        >
                          {p.isPublic ? 'Make Private' : 'Share'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ProjectDrawer project={openProject} onClose={() => setOpenProject(null)} onUpdate={updateProject} user={user} />
      <div className="h-24"/>
    </div>
  )
}
