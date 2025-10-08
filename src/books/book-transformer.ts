import { Book, BookCategory, GitHubBookMeta } from './types'
import { GitHubRepository } from './github-service'
import { uid } from './data'

export class BookTransformer {
  /**
   * Transform a GitHub repository into a Book object
   */
  static transformGitHubRepositoryToBook(
    repository: GitHubRepository,
    readmeContent?: string,
    sectionId?: string
  ): Book {
    const category = this.categorizeRepository(repository)
    const githubMeta = this.createGitHubMeta(repository)
    
    return {
      id: `book-${repository.id}`,
      title: repository.name,
      subtitle: repository.description || undefined,
      author: repository.owner.login,
      emoji: this.getEmojiForCategory(category),
      color: this.getColorForCategory(category),
      sectionId: sectionId || this.getSectionIdForCategory(category),
      ownerId: repository.owner.login,
      ownerName: repository.owner.login,
      isPublic: !repository.private,
      likes: repository.stargazers_count,
      forks: repository.forks_count,
      
      // Book-specific fields
      category,
      tags: repository.topics || [],
      contributors: [], // Will be populated separately if needed
      description: repository.description || undefined,
      readmeContent,
      lastSyncAt: new Date(),
      
      // GitHub metadata
      githubMeta,
      
      // Enhanced project metadata
      meta: {
        kind: 'normal',
        projectType: 'repository',
        language: repository.language || undefined,
        status: repository.archived ? 'archived' : 'active',
        license: repository.license?.name || undefined,
        repository: repository.html_url,
        createdAt: new Date(repository.created_at),
        updatedAt: new Date(repository.updated_at),
        totalFiles: 0, // Will be populated if needed
        totalSize: repository.size * 1024, // Convert KB to bytes
        tags: repository.topics || []
      }
    }
  }

  /**
   * Create GitHub-specific metadata from repository data
   */
  private static createGitHubMeta(repository: GitHubRepository): GitHubBookMeta {
    return {
      githubId: repository.id,
      githubUrl: repository.html_url,
      cloneUrl: repository.clone_url,
      sshUrl: repository.ssh_url,
      defaultBranch: repository.default_branch,
      isPrivate: repository.private,
      language: repository.language,
      stars: repository.stargazers_count,
      watchers: repository.watchers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      lastCommit: new Date(repository.pushed_at),
      createdAt: new Date(repository.created_at),
      updatedAt: new Date(repository.updated_at),
      pushedAt: new Date(repository.pushed_at),
      size: repository.size,
      isArchived: repository.archived,
      isDisabled: repository.disabled,
      topics: repository.topics || [],
      license: repository.license ? {
        key: repository.license.key,
        name: repository.license.name,
        spdxId: repository.license.spdx_id
      } : undefined
    }
  }

  /**
   * Automatically categorize a repository based on its metadata
   */
  private static categorizeRepository(repository: GitHubRepository): BookCategory {
    const name = repository.name.toLowerCase()
    const description = (repository.description || '').toLowerCase()
    const topics = repository.topics?.map(t => t.toLowerCase()) || []
    const language = (repository.language || '').toLowerCase()

    // Combine all text for analysis
    const allText = [name, description, ...topics].join(' ')

    // Game-related keywords
    if (this.matchesKeywords(allText, ['game', 'gaming', 'unity', 'unreal', 'godot', 'pygame', 'phaser', 'canvas', 'webgl', 'three.js']) ||
        topics.includes('game') || topics.includes('gaming')) {
      return BookCategory.GAMES
    }

    // AI/ML keywords
    if (this.matchesKeywords(allText, ['ai', 'artificial-intelligence', 'machine-learning', 'ml', 'deep-learning', 'neural', 'tensorflow', 'pytorch', 'scikit', 'pandas', 'numpy']) ||
        language === 'jupyter notebook' || topics.includes('machine-learning') || topics.includes('artificial-intelligence')) {
      return BookCategory.AI_ML
    }

    // Mobile app keywords
    if (this.matchesKeywords(allText, ['android', 'ios', 'mobile', 'react-native', 'flutter', 'swift', 'kotlin', 'xamarin']) ||
        language === 'swift' || language === 'kotlin' || topics.includes('android') || topics.includes('ios')) {
      return BookCategory.MOBILE_APPS
    }

    // Social media keywords
    if (this.matchesKeywords(allText, ['social', 'chat', 'messaging', 'communication', 'forum', 'community', 'discord', 'slack', 'twitter', 'facebook'])) {
      return BookCategory.SOCIAL_MEDIA
    }

    // Productivity tools
    if (this.matchesKeywords(allText, ['productivity', 'tool', 'utility', 'automation', 'workflow', 'cli', 'command-line', 'script', 'helper'])) {
      return BookCategory.PRODUCTIVITY
    }

    // UI/UX Design
    if (this.matchesKeywords(allText, ['design', 'ui', 'ux', 'interface', 'component', 'design-system', 'figma', 'sketch', 'prototype']) ||
        topics.includes('design') || topics.includes('ui') || topics.includes('ux')) {
      return BookCategory.UI_DESIGN
    }

    // Graphics and visual arts
    if (this.matchesKeywords(allText, ['graphics', 'visual', 'art', 'image', 'photo', 'video', 'animation', 'svg', 'canvas', 'webgl'])) {
      return BookCategory.GRAPHICS
    }

    // Documentation and tutorials
    if (this.matchesKeywords(allText, ['tutorial', 'guide', 'documentation', 'docs', 'learning', 'course', 'example', 'demo', 'sample']) ||
        topics.includes('tutorial') || topics.includes('documentation')) {
      return BookCategory.TUTORIALS
    }

    // Technical documentation
    if (this.matchesKeywords(allText, ['api', 'reference', 'specification', 'manual', 'handbook']) ||
        name.includes('docs') || name.includes('documentation')) {
      return BookCategory.DOCUMENTATION
    }

    // Business and strategy
    if (this.matchesKeywords(allText, ['business', 'strategy', 'marketing', 'sales', 'finance', 'startup', 'entrepreneur'])) {
      return BookCategory.BUSINESS
    }

    // Research and analysis
    if (this.matchesKeywords(allText, ['research', 'analysis', 'study', 'paper', 'academic', 'science', 'data-analysis']) ||
        topics.includes('research') || topics.includes('academic')) {
      return BookCategory.RESEARCH
    }

    // Educational content
    if (this.matchesKeywords(allText, ['education', 'educational', 'school', 'university', 'course', 'curriculum'])) {
      return BookCategory.EDUCATIONAL
    }

    // Web applications (broader category, checked later to avoid false positives)
    if (this.matchesKeywords(allText, ['web', 'website', 'webapp', 'react', 'vue', 'angular', 'next', 'nuxt', 'svelte']) ||
        language === 'javascript' || language === 'typescript' || language === 'html' || language === 'css') {
      return BookCategory.WEB_APPS
    }

    // Default to miscellaneous
    return BookCategory.MISCELLANEOUS
  }

  /**
   * Check if text matches any of the provided keywords
   */
  private static matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  /**
   * Get emoji for a book category
   */
  private static getEmojiForCategory(category: BookCategory): string {
    const emojiMap: Record<BookCategory, string> = {
      [BookCategory.GAMES]: '🎮',
      [BookCategory.WEB_APPS]: '🌐',
      [BookCategory.MOBILE_APPS]: '📱',
      [BookCategory.SOCIAL_MEDIA]: '💬',
      [BookCategory.PRODUCTIVITY]: '⚡',
      [BookCategory.AI_ML]: '🤖',
      [BookCategory.UI_DESIGN]: '🎨',
      [BookCategory.GRAPHICS]: '🖼️',
      [BookCategory.TUTORIALS]: '📚',
      [BookCategory.DOCUMENTATION]: '📖',
      [BookCategory.BUSINESS]: '💼',
      [BookCategory.RESEARCH]: '🔬',
      [BookCategory.UTILITIES]: '🛠️',
      [BookCategory.EDUCATIONAL]: '🎓',
      [BookCategory.SELF_HELP]: '💡',
      [BookCategory.MISCELLANEOUS]: '📦'
    }
    
    return emojiMap[category] || '📦'
  }

  /**
   * Get color gradient for a book category
   */
  private static getColorForCategory(category: BookCategory): string {
    const colorMap: Record<BookCategory, string> = {
      [BookCategory.GAMES]: 'from-purple-500 to-pink-500',
      [BookCategory.WEB_APPS]: 'from-blue-500 to-indigo-600',
      [BookCategory.MOBILE_APPS]: 'from-green-500 to-emerald-600',
      [BookCategory.SOCIAL_MEDIA]: 'from-cyan-500 to-blue-500',
      [BookCategory.PRODUCTIVITY]: 'from-amber-500 to-orange-500',
      [BookCategory.AI_ML]: 'from-violet-500 to-purple-600',
      [BookCategory.UI_DESIGN]: 'from-pink-500 to-rose-500',
      [BookCategory.GRAPHICS]: 'from-red-500 to-pink-500',
      [BookCategory.TUTORIALS]: 'from-emerald-500 to-green-600',
      [BookCategory.DOCUMENTATION]: 'from-teal-500 to-cyan-600',
      [BookCategory.BUSINESS]: 'from-yellow-500 to-amber-500',
      [BookCategory.RESEARCH]: 'from-slate-500 to-gray-600',
      [BookCategory.UTILITIES]: 'from-indigo-500 to-blue-600',
      [BookCategory.EDUCATIONAL]: 'from-lime-500 to-green-500',
      [BookCategory.SELF_HELP]: 'from-orange-500 to-red-500',
      [BookCategory.MISCELLANEOUS]: 'from-gray-500 to-slate-600'
    }
    
    return colorMap[category] || 'from-gray-500 to-slate-600'
  }

  /**
   * Get section ID for a book category (maps to existing sections)
   */
  private static getSectionIdForCategory(category: BookCategory): string {
    const sectionMap: Record<BookCategory, string> = {
      [BookCategory.GAMES]: 'sec-games',
      [BookCategory.WEB_APPS]: 'sec-web-apps',
      [BookCategory.MOBILE_APPS]: 'sec-mobile-apps',
      [BookCategory.SOCIAL_MEDIA]: 'sec-social-media',
      [BookCategory.PRODUCTIVITY]: 'sec-productivity',
      [BookCategory.AI_ML]: 'sec-ai-ml',
      [BookCategory.UI_DESIGN]: 'sec-ui-design',
      [BookCategory.GRAPHICS]: 'sec-graphics',
      [BookCategory.TUTORIALS]: 'sec-tutorials',
      [BookCategory.DOCUMENTATION]: 'sec-documentation',
      [BookCategory.BUSINESS]: 'sec-business',
      [BookCategory.RESEARCH]: 'sec-research',
      [BookCategory.UTILITIES]: 'sec-productivity', // Map to productivity section
      [BookCategory.EDUCATIONAL]: 'sec-tutorials', // Map to tutorials section
      [BookCategory.SELF_HELP]: 'sec-tutorials', // Map to tutorials section
      [BookCategory.MISCELLANEOUS]: 'sec-productivity' // Default to productivity section
    }
    
    return sectionMap[category] || 'sec-productivity'
  }

  /**
   * Batch transform multiple repositories
   */
  static async transformRepositories(
    repositories: GitHubRepository[],
    includeReadme = false,
    githubService?: any
  ): Promise<Book[]> {
    const books: Book[] = []
    
    for (const repo of repositories) {
      let readmeContent: string | undefined
      
      if (includeReadme && githubService) {
        try {
          readmeContent = await githubService.getRepositoryReadme(
            repo.owner.login,
            repo.name
          ) || undefined
        } catch (error) {
          // Continue without README if it fails
          console.warn(`Failed to fetch README for ${repo.full_name}:`, error)
        }
      }
      
      const book = this.transformGitHubRepositoryToBook(repo, readmeContent)
      books.push(book)
    }
    
    return books
  }
}