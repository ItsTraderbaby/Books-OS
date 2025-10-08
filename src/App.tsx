import React from 'react'
import BooksOS from './books/BooksOS'
import Auth from './components/Auth'
import type { User } from './books/types'

export default function App() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('bos_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('bos_user')
      }
    }
    setLoading(false)
  }, [])

  const handleSignIn = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem('bos_user', JSON.stringify(newUser))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('bos_user')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white grid place-items-center mx-auto mb-4 animate-pulse">
            📚
          </div>
          <div className="text-zinc-600">Loading your library...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth onSignIn={handleSignIn} />
  }

  return (
    <main className="min-h-screen">
      <BooksOS user={user} onSignOut={handleSignOut} />
    </main>
  )
}
