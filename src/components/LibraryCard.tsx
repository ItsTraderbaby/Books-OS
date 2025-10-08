import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, Users, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import type { LibraryCardProps } from '../books/types'

export default function LibraryCard({ user, stats }: LibraryCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-amber-100 text-sm font-medium mb-1">COMMUNITY LIBRARY</div>
          <div className="text-2xl font-bold">{user.displayName}</div>
          <div className="text-amber-200 text-sm">@{user.username}</div>
        </div>
        <div className="text-right">
          <div className="text-amber-100 text-xs">CARD NO.</div>
          <div className="font-mono text-lg font-bold">{user.libraryCardNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-amber-200" />
            <span className="text-amber-100 text-xs">PROJECTS</span>
          </div>
          <div className="text-xl font-bold">{stats.totalProjects}</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-amber-200" />
            <span className="text-amber-100 text-xs">READERS</span>
          </div>
          <div className="text-xl font-bold">{stats.totalUsers}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-amber-200">
          <Calendar size={14} />
          <span>Member since {format(user.joinedAt, 'MMM yyyy')}</span>
        </div>
        
        {user.isLibrarian && (
          <div className="bg-amber-500 text-amber-900 px-2 py-1 rounded-full text-xs font-bold">
            LIBRARIAN
          </div>
        )}
      </div>

      {user.bio && (
        <div className="mt-3 pt-3 border-t border-amber-500/30">
          <p className="text-amber-100 text-sm italic">"{user.bio}"</p>
        </div>
      )}

      {user.specialties && user.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {user.specialties.slice(0, 3).map((specialty: string) => (
            <span key={specialty} className="bg-white/20 text-amber-100 px-2 py-1 rounded-full text-xs">
              {specialty}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}