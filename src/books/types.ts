export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  libraryCardNumber: string;
  joinedAt: Date;
  bio?: string;
  specialties?: string[]; // What they work on/contribute to
  isLibrarian?: boolean; // Can moderate sections
};

export type FileItem = {
  id: string;
  title: string;
  content?: string;
  fileType:
    | "text"
    | "markdown"
    | "code"
    | "link"
    | "image"
    | "document"
    | "other";
  extension?: string; // .md, .js, .py, etc.
  url?: string; // For links or external files
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  size?: number; // File size in bytes
};

export type Section = {
  id: string;
  name: string;
  color: string;
  order: number;
  description?: string;
  isPublic: boolean;
  createdBy: string;
  moderators?: string[];
  category:
    | "development"
    | "design"
    | "business"
    | "personal"
    | "research"
    | "education"
    | "other";
  allowedFileTypes?: string[]; // Restrict what can be filed here
};

export type ProjectMeta = {
  kind?: "stack" | "normal"; // Stack for large projects with many files
  priority?: "high" | "medium" | "low";
  tags?: string[];
  projectType?:
    | "repository"
    | "documentation"
    | "collection"
    | "workflow"
    | "template"
    | "archive";
  language?: string; // Programming language or primary language
  framework?: string; // React, Vue, Django, etc.
  status?: "active" | "completed" | "archived" | "draft";
  license?: string; // MIT, GPL, etc.
  repository?: string; // GitHub/GitLab URL
  website?: string; // Live demo URL
  rating?: number;
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
  totalFiles?: number;
  totalSize?: number; // Total size in bytes
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
};

export type ProjectItem = {
  id: string;
  title: string;
  subtitle?: string;
  author?: string; // Original author if different from owner
  emoji?: string;
  color?: string;
  sectionId: string;
  files?: FileItem[]; // The "chapters" are now files
  meta?: ProjectMeta;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  collaborators?: string[];
  likes: number;
  likedBy?: string[];
  forks?: number; // How many times it's been copied
  forkedFrom?: string; // Original project ID if this is a fork
};

export type LibraryStats = {
  totalProjects: number;
  totalUsers: number;
  totalSections: number;
  projectsAddedToday: number;
  activeUsers: number;
  totalFiles: number;
  totalForks: number;
};

export type ViewMode =
  | "wall"
  | "grid"
  | "community"
  | "library3d"
  | "search"
  | "profile";

export type TopBarProps = {
  q: string;
  setQ: (q: string) => void;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  user: User | null;
  onSignOut: () => void;
};

export type LibraryCardProps = {
  user: User;
  stats: LibraryStats;
};

// Add some utility types for the filing system
export type FileTemplate = {
  id: string;
  name: string;
  description: string;
  fileType: FileItem["fileType"];
  template: string; // Template content
  category: string;
};

export type ImportSource = {
  type: "github" | "gitlab" | "url" | "file";
  url?: string;
  token?: string;
};

// Search and Library types
export type SearchFilter = {
  query: string;
  author?: string;
  section?: string;
  projectType?: string;
  language?: string;
  sortBy: "recent" | "popular" | "alphabetical" | "author";
};

export type AuthorProfile = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  specialties: string[];
  totalProjects: number;
  totalLikes: number;
  joinedAt: Date;
};

// Book categorization system
export enum BookCategory {
  GAMES = 'games',
  WEB_APPS = 'web-applications',
  MOBILE_APPS = 'mobile-applications',
  SOCIAL_MEDIA = 'social-media',
  PRODUCTIVITY = 'productivity-tools',
  AI_ML = 'ai-machine-learning',
  UI_DESIGN = 'ui-ux-design',
  GRAPHICS = 'graphics-visual-arts',
  TUTORIALS = 'tutorials-guides',
  DOCUMENTATION = 'technical-documentation',
  BUSINESS = 'business-strategy',
  RESEARCH = 'research-analysis',
  UTILITIES = 'utilities',
  EDUCATIONAL = 'educational',
  SELF_HELP = 'self-help',
  MISCELLANEOUS = 'miscellaneous'
}

// GitHub-specific metadata for books
export type GitHubBookMeta = {
  githubId: number;
  githubUrl: string;
  cloneUrl: string;
  sshUrl: string;
  defaultBranch: string;
  readme?: string;
  isPrivate: boolean;
  language: string | null;
  stars: number;
  watchers: number;
  forks: number;
  openIssues: number;
  lastCommit: Date;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  size: number; // Repository size in KB
  isArchived: boolean;
  isDisabled: boolean;
  topics: string[];
  license?: {
    key: string;
    name: string;
    spdxId: string;
  };
  contributors?: string[];
};

// Extended Book interface that builds on ProjectItem
export interface Book extends ProjectItem {
  // GitHub-specific fields
  githubMeta?: GitHubBookMeta;
  
  // Library-specific fields
  category: BookCategory;
  tags: string[];
  author: string; // GitHub username/display name
  contributors?: string[];
  
  // Enhanced metadata
  description?: string; // Repository description
  readmeContent?: string; // Cached README content
  lastSyncAt?: Date; // When this book was last synced from GitHub
}
