import { createClient } from '@supabase/supabase-js'

// For demo purposes, using placeholder values
// In production, these would come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for development when Supabase isn't configured
export const mockMode = !import.meta.env.VITE_SUPABASE_URL

// Database schema types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string
          avatar?: string
          library_card_number: string
          joined_at: string
          bio?: string
          favorite_genres?: string[]
          is_librarian: boolean
        }
      }
      sections: {
        Row: {
          id: string
          name: string
          color: string
          order: number
          description?: string
          is_public: boolean
          created_by: string
          moderators?: string[]
        }
      }
      books: {
        Row: {
          id: string
          title: string
          subtitle?: string
          author?: string
          emoji?: string
          color?: string
          section_id: string
          owner_id: string
          owner_name: string
          is_public: boolean
          collaborators?: string[]
          likes: number
          liked_by?: string[]
          meta: any
          created_at: string
          updated_at: string
        }
      }
      chapters: {
        Row: {
          id: string
          title: string
          content?: string
          book_id: string
          author_id: string
          created_at: string
          updated_at: string
          is_public: boolean
        }
      }
    }
  }
}