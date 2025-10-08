import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Heart, Zap } from 'lucide-react'
import { supabase, mockMode } from '../lib/supabase'
import type { User } from '../books/types'

type AuthProps = {
  onSignIn: (user: User) => void
}

export default function Auth({ onSignIn }: AuthProps) {
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const generateLibraryCard = () => {
    const prefix = 'LIB'
    const number = Math.random().toString().slice(2, 8)
    return `${prefix}${number}`
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mockMode) {
        // Mock authentication for demo
        const mockUser: User = {
          id: Math.random().toString(36).slice(2),
          email,
          username: username || email.split('@')[0],
          displayName: displayName || email.split('@')[0],
          libraryCardNumber: generateLibraryCard(),
          joinedAt: new Date(),
          isLibrarian: false
        }
        onSignIn(mockUser)
        return
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
              display_name: displayName || username || email.split('@')[0],
              library_card_number: generateLibraryCard()
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            username: data.user.user_metadata.username,
            displayName: data.user.user_metadata.display_name,
            libraryCardNumber: data.user.user_metadata.library_card_number,
            joinedAt: new Date(data.user.created_at),
            isLibrarian: false
          }
          onSignIn(user)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            username: data.user.user_metadata.username || email.split('@')[0],
            displayName: data.user.user_metadata.display_name || email.split('@')[0],
            libraryCardNumber: data.user.user_metadata.library_card_number || generateLibraryCard(),
            joinedAt: new Date(data.user.created_at),
            isLibrarian: data.user.user_metadata.is_librarian || false
          }
          onSignIn(user)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demoSignIn = () => {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@library.com',
      username: 'bookworm',
      displayName: 'Demo Reader',
      libraryCardNumber: 'LIB123456',
      joinedAt: new Date(),
      bio: 'Passionate reader and book collector',
      specialties: ['Development', 'Design', 'Writing'],
      isLibrarian: false
    }
    onSignIn(demoUser)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white grid place-items-center shadow-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-800">Community Library</h1>
              <p className="text-zinc-600">Your digital bookshelf, shared with the world</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">Collaborative Collections</h3>
                <p className="text-zinc-600 text-sm">Build and share book collections with readers worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-green-100 text-green-600 grid place-items-center">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">Discover & Review</h3>
                <p className="text-zinc-600 text-sm">Find new books, leave reviews, and connect with fellow readers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 grid place-items-center">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">Personal Library Card</h3>
                <p className="text-zinc-600 text-sm">Get your unique library card and track your reading journey</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Open Source Library:</strong> This is a community-driven platform where everyone can contribute, 
              organize, and discover books together. Your contributions help build the world's most collaborative library.
            </p>
          </div>
        </motion.div>

        {/* Auth Form */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">
              {isSignUp ? 'Get Your Library Card' : 'Welcome Back'}
            </h2>
            <p className="text-zinc-600">
              {isSignUp ? 'Join our community of readers' : 'Sign in to access your library'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all"
                    placeholder="bookworm123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Library Card' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              {isSignUp ? 'Already have a library card? Sign in' : "Don't have a library card? Sign up"}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-200">
            <button
              onClick={demoSignIn}
              className="w-full bg-zinc-100 text-zinc-700 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-all"
            >
              Try Demo Mode
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}