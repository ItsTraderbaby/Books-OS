import { BookCategory } from './types'

// GitHub API types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  private: boolean
  owner: {
    login: string
    id: number
    avatar_url: string
    html_url: string
  }
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  archived: boolean
  disabled: boolean
  topics: string[]
  license: {
    key: string
    name: string
    spdx_id: string
  } | null
  default_branch: string
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubReadme {
  content: string
  encoding: string
  name: string
  path: string
  sha: string
  size: number
  download_url: string
}

export class GitHubService {
  private baseUrl = 'https://api.github.com'
  private token?: string

  constructor(token?: string) {
    this.token = token
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'BooksOS-Library-System'
    }

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.')
      }
      if (response.status === 404) {
        throw new Error('Repository or user not found.')
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUserRepositories(username: string, page = 1, perPage = 30): Promise<GitHubRepository[]> {
    return this.makeRequest<GitHubRepository[]>(
      `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`
    )
  }

  async getAuthenticatedUserRepositories(page = 1, perPage = 30): Promise<GitHubRepository[]> {
    if (!this.token) {
      throw new Error('Authentication token required for accessing user repositories')
    }
    
    return this.makeRequest<GitHubRepository[]>(
      `/user/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`
    )
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`)
  }

  async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const readme = await this.makeRequest<GitHubReadme>(`/repos/${owner}/${repo}/readme`)
      
      if (readme.encoding === 'base64') {
        return atob(readme.content.replace(/\s/g, ''))
      }
      
      return readme.content
    } catch (error) {
      // README not found or not accessible
      return null
    }
  }

  async getUserProfile(username: string): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${username}`)
  }

  async getAuthenticatedUser(): Promise<GitHubUser> {
    if (!this.token) {
      throw new Error('Authentication token required for accessing user profile')
    }
    
    return this.makeRequest<GitHubUser>('/user')
  }

  // Helper method to check if we have authentication
  isAuthenticated(): boolean {
    return !!this.token
  }

  // Set or update the authentication token
  setToken(token: string): void {
    this.token = token
  }

  // Clear the authentication token
  clearToken(): void {
    this.token = undefined
  }
}

// Singleton instance for the GitHub service
export const githubService = new GitHubService()