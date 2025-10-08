import React from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Star, Plus, Filter } from 'lucide-react'
import type { ProjectItem, User, Section } from '../books/types'

type CommunityViewProps = {
  projects: ProjectItem[]
  sections: Section[]
  user: User
  onLikeProject: (projectId: string) => void
  onForkProject: (project: ProjectItem) => void
}

export default function CommunityView({ projects, sections, user, onLikeProject, onForkProject }: CommunityViewProps) {
  const [filter, setFilter] = React.useState<'all' | 'popular' | 'recent'>('all')
  const [selectedSection, setSelectedSection] = React.useState<string>('all')

  const filteredProjects = React.useMemo(() => {
    let filtered = projects.filter(project => project.isPublic && project.ownerId !== user.id)
    
    if (selectedSection !== 'all') {
      filtered = filtered.filter(project => project.sectionId === selectedSection)
    }
    
    switch (filter) {
      case 'popular':
        return filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      case 'recent':
        return filtered.sort((a, b) => 
          new Date(b.meta?.createdAt || 0).getTime() - new Date(a.meta?.createdAt || 0).getTime()
        )
      default:
        return filtered
    }
  }, [projects, filter, selectedSection, user.id])

  const getSectionName = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.name || 'Unknown'
  }

  const getSectionColor = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.color || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Community Projects</h2>
          <p className="text-zinc-600">Discover amazing projects shared by creators worldwide</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-300 outline-none"
          >
            <option value="all">All Sections</option>
            {sections.filter(s => s.isPublic).map(section => (
              <option key={section.id} value={section.id}>{section.name}</option>
            ))}
          </select>
          
          <div className="inline-flex rounded-lg border border-zinc-300 overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-amber-600 text-white' : 'bg-white text-zinc-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-3 py-2 text-sm ${filter === 'popular' ? 'bg-amber-600 text-white' : 'bg-white text-zinc-700'}`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-3 py-2 text-sm ${filter === 'recent' ? 'bg-amber-600 text-white' : 'bg-white text-zinc-700'}`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
          >
            {/* Project Header */}
            <div className={`h-32 bg-gradient-to-br ${project.color || 'from-zinc-600 to-zinc-800'} p-4 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{project.emoji || '📦'}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSectionColor(project.sectionId)} text-white`}>
                    {getSectionName(project.sectionId)}
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                {project.subtitle && (
                  <p className="text-white/80 text-sm">{project.subtitle}</p>
                )}
              </div>
            </div>

            {/* Project Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span className="text-sm font-medium text-zinc-700">{project.ownerName}</span>
                {project.author && (
                  <>
                    <span className="text-zinc-400">•</span>
                    <span className="text-sm text-zinc-600">by {project.author}</span>
                  </>
                )}
              </div>

              {project.meta?.rating && (
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < project.meta!.rating! ? 'text-yellow-400 fill-current' : 'text-zinc-300'}
                    />
                  ))}
                  <span className="text-sm text-zinc-600 ml-1">({project.meta.rating}/5)</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-zinc-600 mb-3">
                <span>{project.files?.length || 0} files</span>
                <div className="flex items-center gap-2">
                  {project.meta?.projectType && (
                    <span className="bg-zinc-100 px-2 py-1 rounded-full">{project.meta.projectType}</span>
                  )}
                  {project.meta?.language && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{project.meta.language}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikeProject(project.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                      project.likedBy?.includes(user.id)
                        ? 'text-red-600 bg-red-50'
                        : 'text-zinc-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart size={16} className={project.likedBy?.includes(user.id) ? 'fill-current' : ''} />
                    <span className="text-sm">{project.likes || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm">{project.meta?.reviews?.length || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => onForkProject(project)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  <Plus size={14} />
                  Fork Project
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-zinc-800 mb-2">No projects found</h3>
          <p className="text-zinc-600">Try adjusting your filters or be the first to share a project!</p>
        </div>
      )}
    </div>
  )
}