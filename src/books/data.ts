import { ProjectItem, Section, FileTemplate } from './types'

export const initialSections: Section[] = [
  // Development Sections
  { 
    id: 'sec-web-apps', 
    name: 'Web Applications', 
    color: 'from-blue-500 to-indigo-600', 
    order: 0, 
    isPublic: true, 
    createdBy: 'system',
    description: 'React, Vue, Angular, and other web applications',
    category: 'development',
    allowedFileTypes: ['code', 'markdown', 'document']
  },
  { 
    id: 'sec-mobile-apps', 
    name: 'Mobile Applications', 
    color: 'from-green-500 to-emerald-600', 
    order: 1, 
    isPublic: true, 
    createdBy: 'system',
    description: 'iOS, Android, React Native, and Flutter apps',
    category: 'development',
    allowedFileTypes: ['code', 'markdown', 'document']
  },
  { 
    id: 'sec-games', 
    name: 'Games & Interactive', 
    color: 'from-purple-500 to-pink-500', 
    order: 2, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Video games, interactive experiences, and game engines',
    category: 'development',
    allowedFileTypes: ['code', 'image', 'document']
  },
  { 
    id: 'sec-social-media', 
    name: 'Social Media & Communication', 
    color: 'from-cyan-500 to-blue-500', 
    order: 3, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Social platforms, chat apps, and communication tools',
    category: 'development',
    allowedFileTypes: ['code', 'markdown', 'document']
  },
  { 
    id: 'sec-productivity', 
    name: 'Productivity & Tools', 
    color: 'from-amber-500 to-orange-500', 
    order: 4, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Productivity apps, developer tools, and utilities',
    category: 'development',
    allowedFileTypes: ['code', 'markdown', 'document']
  },
  { 
    id: 'sec-ai-ml', 
    name: 'AI & Machine Learning', 
    color: 'from-violet-500 to-purple-600', 
    order: 5, 
    isPublic: true, 
    createdBy: 'system',
    description: 'AI models, machine learning projects, and data science',
    category: 'development',
    allowedFileTypes: ['code', 'document', 'other']
  },
  // Design & Creative
  { 
    id: 'sec-ui-design', 
    name: 'UI/UX Design', 
    color: 'from-pink-500 to-rose-500', 
    order: 6, 
    isPublic: true, 
    createdBy: 'system',
    description: 'User interface designs, wireframes, and prototypes',
    category: 'design',
    allowedFileTypes: ['image', 'document', 'link']
  },
  { 
    id: 'sec-graphics', 
    name: 'Graphics & Visual Arts', 
    color: 'from-red-500 to-pink-500', 
    order: 7, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Illustrations, logos, branding, and visual assets',
    category: 'design',
    allowedFileTypes: ['image', 'document', 'link']
  },
  // Documentation & Education
  { 
    id: 'sec-tutorials', 
    name: 'Tutorials & Guides', 
    color: 'from-emerald-500 to-green-600', 
    order: 8, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Step-by-step tutorials and educational content',
    category: 'education',
    allowedFileTypes: ['markdown', 'document', 'text']
  },
  { 
    id: 'sec-documentation', 
    name: 'Technical Documentation', 
    color: 'from-teal-500 to-cyan-600', 
    order: 9, 
    isPublic: true, 
    createdBy: 'system',
    description: 'API docs, technical specifications, and references',
    category: 'education',
    allowedFileTypes: ['markdown', 'document', 'text']
  },
  // Business & Research
  { 
    id: 'sec-business', 
    name: 'Business & Strategy', 
    color: 'from-yellow-500 to-amber-500', 
    order: 10, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Business plans, market analysis, and strategic documents',
    category: 'business',
    allowedFileTypes: ['document', 'text', 'link']
  },
  { 
    id: 'sec-research', 
    name: 'Research & Analysis', 
    color: 'from-slate-500 to-gray-600', 
    order: 11, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Research papers, data analysis, and academic work',
    category: 'research',
    allowedFileTypes: ['document', 'text', 'link', 'other']
  },
  // Additional sections for book categories
  { 
    id: 'sec-utilities', 
    name: 'Utilities', 
    color: 'from-indigo-500 to-blue-600', 
    order: 12, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Helper libraries, frameworks, and development tools',
    category: 'development',
    allowedFileTypes: ['code', 'markdown', 'document']
  },
  { 
    id: 'sec-educational', 
    name: 'Educational', 
    color: 'from-lime-500 to-green-500', 
    order: 13, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Academic projects, coursework, and learning materials',
    category: 'education',
    allowedFileTypes: ['markdown', 'document', 'text']
  },
  { 
    id: 'sec-self-help', 
    name: 'Self Help', 
    color: 'from-rose-500 to-pink-600', 
    order: 14, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Personal development and self-improvement resources',
    category: 'personal',
    allowedFileTypes: ['markdown', 'document', 'text']
  },
  { 
    id: 'sec-miscellaneous', 
    name: 'Miscellaneous', 
    color: 'from-gray-500 to-slate-600', 
    order: 15, 
    isPublic: true, 
    createdBy: 'system',
    description: 'Other projects that don\'t fit into specific categories',
    category: 'other',
    allowedFileTypes: ['code', 'markdown', 'document', 'text', 'image', 'link', 'other']
  },
]

export const seedProjects: ProjectItem[] = [
  { 
    id: 'p1', 
    title: 'React Dashboard Template', 
    subtitle: 'Modern admin dashboard with TypeScript',
    emoji: '⚛️', 
    color: 'from-blue-600 to-indigo-700', 
    sectionId: 'sec-development', 
    ownerId: '', 
    ownerName: '', 
    isPublic: false,
    likes: 0,
    forks: 0,
    files: [ 
      { id: 'f1', title: 'README.md', fileType: 'markdown', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false, content: '# React Dashboard\n\nA modern dashboard template...' }, 
      { id: 'f2', title: 'App.tsx', fileType: 'code', extension: '.tsx', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false, content: 'import React from "react"...' },
      { id: 'f3', title: 'package.json', fileType: 'code', extension: '.json', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false }
    ],
    meta: {
      kind: 'normal',
      projectType: 'repository',
      language: 'TypeScript',
      framework: 'React',
      status: 'active',
      license: 'MIT',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalFiles: 3
    }
  },
  { 
    id: 'p2', 
    title: 'Brand Guidelines', 
    subtitle: 'Complete visual identity system',
    emoji: '🎨', 
    color: 'from-purple-600 to-pink-700', 
    sectionId: 'sec-design', 
    ownerId: '', 
    ownerName: '', 
    isPublic: false,
    likes: 0,
    forks: 0,
    files: [ 
      { id: 'f4', title: 'Logo Assets', fileType: 'image', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f5', title: 'Color Palette', fileType: 'document', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f6', title: 'Typography Guide', fileType: 'document', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false }
    ],
    meta: {
      kind: 'normal',
      projectType: 'collection',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalFiles: 3
    }
  },
  { 
    id: 'p3', 
    title: 'API Documentation', 
    subtitle: 'RESTful API reference and guides',
    emoji: '📚', 
    color: 'from-green-600 to-emerald-700', 
    sectionId: 'sec-documentation', 
    ownerId: '', 
    ownerName: '', 
    isPublic: false,
    likes: 0,
    forks: 0,
    files: [ 
      { id: 'f7', title: 'Getting Started', fileType: 'markdown', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f8', title: 'Authentication', fileType: 'markdown', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f9', title: 'Endpoints Reference', fileType: 'markdown', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false }
    ],
    meta: {
      kind: 'normal',
      projectType: 'documentation',
      language: 'English',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalFiles: 3
    }
  },
  { 
    id: 'p4', 
    title: 'Startup Toolkit', 
    subtitle: 'Templates and resources for new businesses',
    emoji: '🚀', 
    color: 'from-amber-600 to-orange-700', 
    sectionId: 'sec-business', 
    ownerId: '', 
    ownerName: '', 
    isPublic: false,
    likes: 0,
    forks: 0,
    files: [ 
      { id: 'f10', title: 'Business Plan Template', fileType: 'document', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f11', title: 'Pitch Deck Template', fileType: 'document', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false },
      { id: 'f12', title: 'Legal Checklist', fileType: 'text', authorId: '', createdAt: new Date(), updatedAt: new Date(), isPublic: false }
    ],
    meta: { 
      kind: 'stack',
      projectType: 'template',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalFiles: 3
    }
  },
]

export const uid = () => Math.random().toString(36).slice(2,9)
export const classNames = (...cx: Array<string | false | null | undefined>) => cx.filter(Boolean).join(' ')
export const spineWidth = (title: string) => {
  const n = Array.from(title).reduce((a,c)=>a+c.charCodeAt(0),0)
  const widths = [40,44,48,52,56,60,64]
  return widths[n % widths.length]
}
// File templates for quick project creation
export const fileTemplates: FileTemplate[] = [
  {
    id: 'template-readme',
    name: 'README.md',
    description: 'Standard project README file',
    fileType: 'markdown',
    category: 'documentation',
    template: `# Project Title

## Description
Brief description of your project.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
How to use your project.

## Contributing
Guidelines for contributing.

## License
MIT License`
  },
  {
    id: 'template-gitignore',
    name: '.gitignore',
    description: 'Git ignore file for common patterns',
    fileType: 'text',
    category: 'development',
    template: `node_modules/
.env
.DS_Store
dist/
build/
*.log`
  },
  {
    id: 'template-package-json',
    name: 'package.json',
    description: 'Node.js package configuration',
    fileType: 'code',
    category: 'development',
    template: `{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}`
  },
  {
    id: 'template-component',
    name: 'Component.tsx',
    description: 'React TypeScript component',
    fileType: 'code',
    category: 'development',
    template: `import React from 'react'

interface ComponentProps {
  // Define your props here
}

export default function Component({ }: ComponentProps) {
  return (
    <div>
      {/* Your component JSX */}
    </div>
  )
}`
  },
  {
    id: 'template-api-doc',
    name: 'API Documentation',
    description: 'API endpoint documentation template',
    fileType: 'markdown',
    category: 'documentation',
    template: `# API Endpoint

## Overview
Brief description of what this endpoint does.

## Request
\`\`\`
GET /api/endpoint
\`\`\`

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1    | string | Yes    | Description |

## Response
\`\`\`json
{
  "status": "success",
  "data": {}
}
\`\`\`

## Examples
Example requests and responses.`
  }
]

// Project type suggestions based on section
export const projectSuggestions = {
  'sec-development': [
    { emoji: '⚛️', title: 'React App', type: 'repository' },
    { emoji: '🐍', title: 'Python Script', type: 'repository' },
    { emoji: '🌐', title: 'Web API', type: 'repository' },
    { emoji: '📱', title: 'Mobile App', type: 'repository' },
    { emoji: '🛠️', title: 'CLI Tool', type: 'repository' }
  ],
  'sec-design': [
    { emoji: '🎨', title: 'Design System', type: 'collection' },
    { emoji: '🖼️', title: 'Asset Library', type: 'collection' },
    { emoji: '📐', title: 'Wireframes', type: 'collection' },
    { emoji: '🎭', title: 'Brand Identity', type: 'collection' }
  ],
  'sec-documentation': [
    { emoji: '📚', title: 'User Guide', type: 'documentation' },
    { emoji: '🔧', title: 'Technical Docs', type: 'documentation' },
    { emoji: '📖', title: 'Tutorial Series', type: 'documentation' },
    { emoji: '❓', title: 'FAQ Collection', type: 'documentation' }
  ],
  'sec-business': [
    { emoji: '📊', title: 'Business Plan', type: 'template' },
    { emoji: '💼', title: 'Strategy Docs', type: 'collection' },
    { emoji: '📈', title: 'Market Research', type: 'collection' },
    { emoji: '🎯', title: 'Marketing Plan', type: 'template' }
  ],
  'sec-research': [
    { emoji: '🔬', title: 'Research Paper', type: 'documentation' },
    { emoji: '📊', title: 'Data Analysis', type: 'collection' },
    { emoji: '📋', title: 'Survey Results', type: 'collection' },
    { emoji: '🧪', title: 'Experiment Log', type: 'documentation' }
  ],
  'sec-personal': [
    { emoji: '📝', title: 'Notes Collection', type: 'collection' },
    { emoji: '🎯', title: 'Goals & Plans', type: 'template' },
    { emoji: '📚', title: 'Learning Path', type: 'documentation' },
    { emoji: '💡', title: 'Ideas Journal', type: 'collection' }
  ]
}