import { BookCategory } from './types';

export interface CategoryRule {
  keywords: string[];
  filePatterns: string[];
  languagePatterns: string[];
  topicPatterns: string[];
  category: BookCategory;
  confidence: number;
}

export interface CategorizationResult {
  category: BookCategory;
  confidence: number;
  matchedRules: string[];
}

export interface GitHubRepository {
  name: string;
  description?: string;
  language?: string;
  topics: string[];
  files?: string[];
  readme?: string;
}

export class CategoryService {
  private rules: CategoryRule[] = [
    // Games & Interactive
    {
      keywords: ['game', 'gaming', 'unity', 'unreal', 'godot', 'phaser', 'pygame', 'canvas', 'webgl', 'three.js', 'babylonjs', 'arcade', 'puzzle', 'rpg', 'platformer', 'shooter', 'strategy', 'simulation', 'multiplayer', 'gamedev'],
      filePatterns: ['*.unity', '*.cs', '*.cpp', '*.h', '*.hlsl', '*.shader', '*.gd', '*.tscn', '*.godot'],
      languagePatterns: ['c#', 'c++', 'gdscript', 'lua'],
      topicPatterns: ['game', 'gaming', 'unity', 'unreal', 'godot', 'phaser', 'gamedev', 'game-development', 'indie-game', 'html5-game'],
      category: BookCategory.GAMES,
      confidence: 0.9
    },
    
    // Web Applications
    {
      keywords: ['web', 'website', 'webapp', 'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'gatsby', 'frontend', 'backend', 'fullstack', 'spa', 'pwa', 'dashboard', 'admin', 'cms', 'blog', 'ecommerce', 'portfolio'],
      filePatterns: ['package.json', '*.jsx', '*.tsx', '*.vue', '*.svelte', 'index.html', 'webpack.config.js', 'vite.config.js', 'next.config.js'],
      languagePatterns: ['javascript', 'typescript', 'html', 'css', 'scss', 'sass'],
      topicPatterns: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'web', 'frontend', 'backend', 'fullstack', 'webapp', 'website', 'spa', 'pwa'],
      category: BookCategory.WEB_APPS,
      confidence: 0.85
    },
    
    // Mobile Applications
    {
      keywords: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'xamarin', 'cordova', 'phonegap', 'ionic', 'app', 'swift', 'kotlin', 'objective-c', 'dart'],
      filePatterns: ['*.swift', '*.kt', '*.java', '*.dart', '*.m', '*.mm', 'pubspec.yaml', 'Podfile', 'build.gradle', 'AndroidManifest.xml', 'Info.plist'],
      languagePatterns: ['swift', 'kotlin', 'java', 'dart', 'objective-c'],
      topicPatterns: ['ios', 'android', 'mobile', 'react-native', 'flutter', 'swift', 'kotlin', 'mobile-app', 'app'],
      category: BookCategory.MOBILE_APPS,
      confidence: 0.9
    },
    
    // AI & Machine Learning
    {
      keywords: ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural', 'tensorflow', 'pytorch', 'keras', 'scikit', 'pandas', 'numpy', 'opencv', 'nlp', 'computer-vision', 'data-science', 'artificial-intelligence', 'model', 'training', 'dataset', 'algorithm'],
      filePatterns: ['*.py', '*.ipynb', '*.h5', '*.pkl', '*.pt', '*.pth', 'requirements.txt', 'environment.yml'],
      languagePatterns: ['python', 'r', 'julia'],
      topicPatterns: ['machine-learning', 'deep-learning', 'ai', 'artificial-intelligence', 'tensorflow', 'pytorch', 'data-science', 'nlp', 'computer-vision', 'neural-network'],
      category: BookCategory.AI_ML,
      confidence: 0.95
    },
    
    // Social Media & Communication
    {
      keywords: ['social', 'chat', 'messaging', 'communication', 'forum', 'community', 'discord', 'slack', 'telegram', 'whatsapp', 'twitter', 'facebook', 'instagram', 'social-network', 'real-time', 'websocket', 'socket.io'],
      filePatterns: ['*.js', '*.ts', 'package.json'],
      languagePatterns: ['javascript', 'typescript', 'go', 'elixir'],
      topicPatterns: ['social', 'chat', 'messaging', 'communication', 'discord-bot', 'telegram-bot', 'social-media', 'real-time'],
      category: BookCategory.SOCIAL_MEDIA,
      confidence: 0.8
    },
    
    // Productivity & Tools
    {
      keywords: ['productivity', 'tool', 'utility', 'cli', 'automation', 'workflow', 'task', 'todo', 'calendar', 'note', 'editor', 'ide', 'extension', 'plugin', 'script', 'helper', 'converter', 'generator', 'organizer'],
      filePatterns: ['*.sh', '*.bat', '*.ps1', 'Makefile', 'Dockerfile', '*.py', '*.js', '*.go'],
      languagePatterns: ['python', 'go', 'rust', 'bash', 'powershell'],
      topicPatterns: ['cli', 'tool', 'utility', 'automation', 'productivity', 'workflow', 'script', 'helper'],
      category: BookCategory.PRODUCTIVITY,
      confidence: 0.7
    },
    
    // UI/UX Design
    {
      keywords: ['design', 'ui', 'ux', 'interface', 'component', 'design-system', 'figma', 'sketch', 'adobe', 'prototype', 'wireframe', 'mockup', 'style-guide', 'brand', 'theme', 'css', 'sass', 'styled-components'],
      filePatterns: ['*.css', '*.scss', '*.sass', '*.less', '*.styl', '*.fig', '*.sketch', '*.psd', '*.ai'],
      languagePatterns: ['css', 'scss', 'sass'],
      topicPatterns: ['design', 'ui', 'ux', 'design-system', 'components', 'css', 'styling', 'theme'],
      category: BookCategory.UI_DESIGN,
      confidence: 0.8
    },
    
    // Graphics & Visual Arts
    {
      keywords: ['graphics', 'visual', 'art', 'image', 'photo', 'video', 'animation', 'render', '3d', 'blender', 'maya', 'photoshop', 'illustrator', 'after-effects', 'cinema4d', 'opengl', 'vulkan', 'directx'],
      filePatterns: ['*.blend', '*.ma', '*.mb', '*.max', '*.c4d', '*.psd', '*.ai', '*.svg', '*.png', '*.jpg', '*.gif', '*.mp4', '*.mov'],
      languagePatterns: ['glsl', 'hlsl', 'c++', 'c#'],
      topicPatterns: ['graphics', 'visual', 'art', '3d', 'animation', 'rendering', 'blender', 'opengl'],
      category: BookCategory.GRAPHICS,
      confidence: 0.85
    },
    
    // Tutorials & Guides
    {
      keywords: ['tutorial', 'guide', 'learn', 'course', 'lesson', 'example', 'demo', 'sample', 'walkthrough', 'how-to', 'step-by-step', 'beginner', 'introduction', 'getting-started', 'workshop'],
      filePatterns: ['README.md', '*.md', 'tutorial.md', 'guide.md', 'TUTORIAL.md', 'GUIDE.md'],
      languagePatterns: ['markdown'],
      topicPatterns: ['tutorial', 'guide', 'learning', 'course', 'example', 'demo', 'education', 'how-to'],
      category: BookCategory.TUTORIALS,
      confidence: 0.75
    },
    
    // Technical Documentation
    {
      keywords: ['documentation', 'docs', 'api', 'reference', 'manual', 'specification', 'spec', 'wiki', 'knowledge', 'help', 'faq', 'changelog', 'release-notes'],
      filePatterns: ['docs/', 'documentation/', '*.md', 'API.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE.md'],
      languagePatterns: ['markdown'],
      topicPatterns: ['documentation', 'docs', 'api', 'reference', 'manual', 'wiki'],
      category: BookCategory.DOCUMENTATION,
      confidence: 0.8
    },
    
    // Business & Strategy
    {
      keywords: ['business', 'strategy', 'plan', 'market', 'analysis', 'finance', 'accounting', 'crm', 'erp', 'sales', 'marketing', 'startup', 'entrepreneur', 'investment', 'revenue'],
      filePatterns: ['*.xlsx', '*.csv', '*.pdf', 'business-plan.md', 'strategy.md'],
      languagePatterns: [],
      topicPatterns: ['business', 'strategy', 'finance', 'marketing', 'startup', 'entrepreneur'],
      category: BookCategory.BUSINESS,
      confidence: 0.7
    },
    
    // Research & Analysis
    {
      keywords: ['research', 'analysis', 'study', 'paper', 'thesis', 'academic', 'science', 'experiment', 'data', 'statistics', 'survey', 'report', 'findings', 'methodology'],
      filePatterns: ['*.tex', '*.bib', '*.pdf', '*.csv', '*.xlsx', '*.r', '*.py', '*.ipynb'],
      languagePatterns: ['r', 'python', 'latex'],
      topicPatterns: ['research', 'analysis', 'academic', 'science', 'data-analysis', 'statistics'],
      category: BookCategory.RESEARCH,
      confidence: 0.8
    },
    
    // Educational
    {
      keywords: ['education', 'school', 'university', 'college', 'student', 'teacher', 'curriculum', 'assignment', 'homework', 'project', 'class', 'lecture', 'quiz', 'exam'],
      filePatterns: ['*.md', '*.pdf', '*.ppt', '*.pptx'],
      languagePatterns: [],
      topicPatterns: ['education', 'school', 'university', 'learning', 'student', 'curriculum'],
      category: BookCategory.EDUCATIONAL,
      confidence: 0.7
    },
    
    // Utilities
    {
      keywords: ['utility', 'util', 'helper', 'library', 'framework', 'package', 'module', 'component', 'boilerplate', 'template', 'starter', 'scaffold'],
      filePatterns: ['package.json', 'setup.py', 'Cargo.toml', 'go.mod', 'composer.json'],
      languagePatterns: [],
      topicPatterns: ['utility', 'library', 'framework', 'package', 'boilerplate', 'template'],
      category: BookCategory.UTILITIES,
      confidence: 0.6
    }
  ];

  /**
   * Categorizes a GitHub repository into a book category
   */
  categorizeRepository(repository: GitHubRepository): CategorizationResult {
    const results: CategorizationResult[] = [];
    
    for (const rule of this.rules) {
      const confidence = this.calculateConfidence(repository, rule);
      if (confidence > 0) {
        results.push({
          category: rule.category,
          confidence: confidence * rule.confidence,
          matchedRules: this.getMatchedRules(repository, rule)
        });
      }
    }
    
    // Sort by confidence and return the highest scoring category
    results.sort((a, b) => b.confidence - a.confidence);
    
    if (results.length === 0 || results[0].confidence < 0.3) {
      return {
        category: BookCategory.MISCELLANEOUS,
        confidence: 0.5,
        matchedRules: ['default-fallback']
      };
    }
    
    return results[0];
  }

  /**
   * Gets all available categories with their metadata
   */
  getCategories(): Array<{
    id: BookCategory;
    name: string;
    description: string;
    color: string;
    icon: string;
  }> {
    return [
      {
        id: BookCategory.GAMES,
        name: 'Games & Interactive',
        description: 'Video games, interactive experiences, and game engines',
        color: 'from-purple-500 to-pink-500',
        icon: '🎮'
      },
      {
        id: BookCategory.WEB_APPS,
        name: 'Web Applications',
        description: 'React, Vue, Angular, and other web applications',
        color: 'from-blue-500 to-indigo-600',
        icon: '🌐'
      },
      {
        id: BookCategory.MOBILE_APPS,
        name: 'Mobile Applications',
        description: 'iOS, Android, React Native, and Flutter apps',
        color: 'from-green-500 to-emerald-600',
        icon: '📱'
      },
      {
        id: BookCategory.SOCIAL_MEDIA,
        name: 'Social Media & Communication',
        description: 'Social platforms, chat apps, and communication tools',
        color: 'from-cyan-500 to-blue-500',
        icon: '💬'
      },
      {
        id: BookCategory.PRODUCTIVITY,
        name: 'Productivity & Tools',
        description: 'Productivity apps, developer tools, and utilities',
        color: 'from-amber-500 to-orange-500',
        icon: '🛠️'
      },
      {
        id: BookCategory.AI_ML,
        name: 'AI & Machine Learning',
        description: 'AI models, machine learning projects, and data science',
        color: 'from-violet-500 to-purple-600',
        icon: '🤖'
      },
      {
        id: BookCategory.UI_DESIGN,
        name: 'UI/UX Design',
        description: 'User interface designs, wireframes, and prototypes',
        color: 'from-pink-500 to-rose-500',
        icon: '🎨'
      },
      {
        id: BookCategory.GRAPHICS,
        name: 'Graphics & Visual Arts',
        description: 'Illustrations, logos, branding, and visual assets',
        color: 'from-red-500 to-pink-500',
        icon: '🖼️'
      },
      {
        id: BookCategory.TUTORIALS,
        name: 'Tutorials & Guides',
        description: 'Step-by-step tutorials and educational content',
        color: 'from-emerald-500 to-green-600',
        icon: '📚'
      },
      {
        id: BookCategory.DOCUMENTATION,
        name: 'Technical Documentation',
        description: 'API docs, technical specifications, and references',
        color: 'from-teal-500 to-cyan-600',
        icon: '📖'
      },
      {
        id: BookCategory.BUSINESS,
        name: 'Business & Strategy',
        description: 'Business plans, market analysis, and strategic documents',
        color: 'from-yellow-500 to-amber-500',
        icon: '💼'
      },
      {
        id: BookCategory.RESEARCH,
        name: 'Research & Analysis',
        description: 'Research papers, data analysis, and academic work',
        color: 'from-slate-500 to-gray-600',
        icon: '🔬'
      },
      {
        id: BookCategory.UTILITIES,
        name: 'Utilities',
        description: 'Helper libraries, frameworks, and development tools',
        color: 'from-indigo-500 to-blue-600',
        icon: '⚙️'
      },
      {
        id: BookCategory.EDUCATIONAL,
        name: 'Educational',
        description: 'Academic projects, coursework, and learning materials',
        color: 'from-lime-500 to-green-500',
        icon: '🎓'
      },
      {
        id: BookCategory.SELF_HELP,
        name: 'Self Help',
        description: 'Personal development and self-improvement resources',
        color: 'from-rose-500 to-pink-600',
        icon: '💡'
      },
      {
        id: BookCategory.MISCELLANEOUS,
        name: 'Miscellaneous',
        description: 'Other projects that don\'t fit into specific categories',
        color: 'from-gray-500 to-slate-600',
        icon: '📦'
      }
    ];
  }

  /**
   * Updates the categorization rules (for future extensibility)
   */
  updateCategoryRules(rules: CategoryRule[]): void {
    this.rules = rules;
  }

  /**
   * Calculates confidence score for a repository against a specific rule
   */
  private calculateConfidence(repository: GitHubRepository, rule: CategoryRule): number {
    let score = 0;
    let maxScore = 0;
    
    // Check keywords in name and description
    const text = `${repository.name} ${repository.description || ''} ${repository.readme || ''}`.toLowerCase();
    const keywordMatches = rule.keywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
    if (rule.keywords.length > 0) {
      score += (keywordMatches / rule.keywords.length) * 0.4;
      maxScore += 0.4;
    }
    
    // Check language patterns
    if (rule.languagePatterns.length > 0 && repository.language) {
      const languageMatch = rule.languagePatterns.some(lang => 
        repository.language?.toLowerCase().includes(lang.toLowerCase())
      );
      if (languageMatch) {
        score += 0.3;
      }
      maxScore += 0.3;
    }
    
    // Check topic patterns
    if (rule.topicPatterns.length > 0 && repository.topics.length > 0) {
      const topicMatches = rule.topicPatterns.filter(pattern =>
        repository.topics.some(topic => topic.toLowerCase().includes(pattern.toLowerCase()))
      ).length;
      score += (topicMatches / rule.topicPatterns.length) * 0.2;
      maxScore += 0.2;
    }
    
    // Check file patterns (if files are provided)
    if (rule.filePatterns.length > 0 && repository.files && repository.files.length > 0) {
      const fileMatches = rule.filePatterns.filter(pattern =>
        repository.files!.some(file => this.matchesPattern(file, pattern))
      ).length;
      score += (fileMatches / rule.filePatterns.length) * 0.1;
      maxScore += 0.1;
    }
    
    // Normalize score
    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * Gets the matched rules for debugging/transparency
   */
  private getMatchedRules(repository: GitHubRepository, rule: CategoryRule): string[] {
    const matches: string[] = [];
    const text = `${repository.name} ${repository.description || ''}`.toLowerCase();
    
    // Check which keywords matched
    rule.keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        matches.push(`keyword:${keyword}`);
      }
    });
    
    // Check language match
    if (repository.language && rule.languagePatterns.some(lang => 
      repository.language?.toLowerCase().includes(lang.toLowerCase())
    )) {
      matches.push(`language:${repository.language}`);
    }
    
    // Check topic matches
    rule.topicPatterns.forEach(pattern => {
      if (repository.topics.some(topic => topic.toLowerCase().includes(pattern.toLowerCase()))) {
        matches.push(`topic:${pattern}`);
      }
    });
    
    return matches;
  }

  /**
   * Simple pattern matching for file names
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filename);
    }
    return filename.includes(pattern);
  }
}