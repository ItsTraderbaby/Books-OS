# Universal Filing System - Library OS

A collaborative filing system disguised as a beautiful library. Like GitHub meets library aesthetics - organize any type of project, document, or content with the tactile feel of arranging books on shelves. Connect with creators and discover amazing projects from the community.

## ✨ Features

### 🏛️ **Community Filing System**
- **Get your library card** - Join our community of creators and organizers
- **Share your projects** - Make your work public for others to discover and fork
- **Discover amazing work** - Browse projects shared by the community
- **Like & fork** - Engage with projects and create your own versions
- **Import from anywhere** - GitHub repos, URLs, files - everything becomes a "book"

### 📚 **Universal Project Management**
- **3D Library Interface** - Organize any type of project with beautiful book spines
- **Flexible Filing** - Code repos, design assets, docs, business plans - anything goes
- **Smart Sections** - Development, Design, Documentation, Business, Research, Personal
- **File Type Support** - Markdown, code, images, documents, links, and more
- **Drag & Drop** - Intuitive organization between sections

### 🎨 **Beautiful Design**
- **Realistic 3D Books** - Projects displayed as books with custom spines and colors
- **Project Type Icons** - Visual indicators for repositories, docs, collections, templates
- **Animated Interactions** - Smooth transitions and micro-interactions
- **Multiple Views** - Bookshelf, grid, and community discovery modes
- **Smart Search** - Find projects quickly with ⌘K search

### 🔧 **Developer-Friendly**
- **GitHub Integration** - Import repositories as books automatically
- **File Templates** - Quick-start templates for common project types
- **Language Detection** - Automatic language/framework identification
- **Fork & Collaborate** - Copy and modify others' projects
- **Version Tracking** - See project status and update history

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo>
cd books-os
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and either:
- **Try Demo Mode** - Explore the filing system without signing up
- **Create Account** - Get your library card and start organizing your projects

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Authentication**: Supabase Auth (with demo mode)
- **Database**: Supabase (with localStorage fallback)
- **Icons**: Lucide React
- **Build**: Vite with optimized production builds

## 📖 How to Use

### Getting Started
1. **Sign Up** - Create your account and get a library card
2. **Explore Sample Projects** - Check out demo projects in different sections
3. **Create Your First Project** - Add files and organize your work
4. **Import Existing Work** - Bring in GitHub repos, documents, or any files
5. **Share with Community** - Make projects public to share with others

### Organizing Your Work
- **Sections**: Development, Design, Documentation, Business, Research, Personal
- **Projects**: Any collection of related files (like books on a shelf)
- **Files**: Individual documents, code files, images, links (like chapters)
- **Stacks**: Special thick spine layout for large projects with many files

### Community Features
- **Browse Community** - Discover projects shared by other creators
- **Fork Projects** - Copy interesting projects to your own library
- **Like & Review** - Show appreciation and provide feedback
- **Import & Share** - Bring external work in, share your creations out

## 🎯 Use Cases

### Development Projects
- **Code Repositories** - Import GitHub repos and organize them visually
- **API Documentation** - Create beautiful docs with multiple files
- **Component Libraries** - Organize reusable code components
- **Project Templates** - Share starter templates for common frameworks

### Design & Creative Work
- **Design Systems** - Organize brand guidelines, assets, and components
- **Portfolio Projects** - Showcase creative work with multiple assets
- **Asset Libraries** - Collect and organize design resources
- **Style Guides** - Document visual identity and usage guidelines

### Business & Documentation
- **Business Plans** - Organize strategy documents and resources
- **Process Documentation** - Create step-by-step workflow guides
- **Knowledge Bases** - Build searchable collections of information
- **Training Materials** - Organize educational content and resources

### Personal Organization
- **Learning Paths** - Structure study materials and progress tracking
- **Research Collections** - Organize papers, links, and findings
- **Idea Journals** - Capture and develop creative thoughts
- **Project Archives** - Keep completed work organized and accessible

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for Supabase integration:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Without these, the app runs in demo mode with localStorage.

### Deployment
- **Vercel**: Connect your repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder after `npm run build`
- **GitHub Pages**: Enable Pages in repository settings

## 🤝 Contributing

This is an open-source community library! Contributions welcome:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Submit a pull request**

### Ideas for Contributions
- New book layouts and themes
- Enhanced search and filtering
- Social features (following users, comments)
- Import/export functionality
- Mobile app companion
- Plugin system for custom book types

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🌟 Vision

We're building the world's most beautiful and intuitive filing system. A place where:
- **Any type of work** can be organized and shared beautifully
- **Creators connect** and collaborate on amazing projects
- **Personal organization** meets community discovery
- **Beautiful design** makes file management actually enjoyable
- **GitHub meets library aesthetics** - technical power with visual delight

Join us in reimagining how we organize and share our digital work! 📚✨

---

*"Every project deserves a beautiful spine on the shelf of the internet."*