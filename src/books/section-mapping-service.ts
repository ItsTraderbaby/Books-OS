import { BookCategory, Section } from './types';
import { initialSections } from './data';

/**
 * Service to handle mapping between book categories and sections
 */
export class SectionMappingService {
  private categoryToSectionMap: Map<BookCategory, string> = new Map([
    [BookCategory.WEB_APPS, 'sec-web-apps'],
    [BookCategory.MOBILE_APPS, 'sec-mobile-apps'],
    [BookCategory.GAMES, 'sec-games'],
    [BookCategory.SOCIAL_MEDIA, 'sec-social-media'],
    [BookCategory.PRODUCTIVITY, 'sec-productivity'],
    [BookCategory.AI_ML, 'sec-ai-ml'],
    [BookCategory.UI_DESIGN, 'sec-ui-design'],
    [BookCategory.GRAPHICS, 'sec-graphics'],
    [BookCategory.TUTORIALS, 'sec-tutorials'],
    [BookCategory.DOCUMENTATION, 'sec-documentation'],
    [BookCategory.BUSINESS, 'sec-business'],
    [BookCategory.RESEARCH, 'sec-research'],
    [BookCategory.UTILITIES, 'sec-utilities'],
    [BookCategory.EDUCATIONAL, 'sec-educational'],
    [BookCategory.SELF_HELP, 'sec-self-help'],
    [BookCategory.MISCELLANEOUS, 'sec-miscellaneous'],
  ]);

  private sectionToCategoryMap: Map<string, BookCategory> = new Map();

  constructor() {
    // Build reverse mapping
    for (const [category, sectionId] of this.categoryToSectionMap.entries()) {
      this.sectionToCategoryMap.set(sectionId, category);
    }
  }

  /**
   * Gets the section ID for a given book category
   */
  getSectionIdForCategory(category: BookCategory): string {
    return this.categoryToSectionMap.get(category) || 'sec-miscellaneous';
  }

  /**
   * Gets the book category for a given section ID
   */
  getCategoryForSection(sectionId: string): BookCategory {
    return this.sectionToCategoryMap.get(sectionId) || BookCategory.MISCELLANEOUS;
  }

  /**
   * Gets all sections that correspond to book categories
   */
  getBookSections(): Section[] {
    return initialSections.filter(section => 
      this.sectionToCategoryMap.has(section.id)
    );
  }

  /**
   * Gets section information for a category
   */
  getSectionForCategory(category: BookCategory): Section | undefined {
    const sectionId = this.getSectionIdForCategory(category);
    return initialSections.find(section => section.id === sectionId);
  }

  /**
   * Automatically assigns a section to a book based on its category
   */
  assignSectionToBook(category: BookCategory): string {
    return this.getSectionIdForCategory(category);
  }

  /**
   * Gets all available category-section mappings
   */
  getAllMappings(): Array<{ category: BookCategory; sectionId: string; section: Section }> {
    const mappings: Array<{ category: BookCategory; sectionId: string; section: Section }> = [];
    
    for (const [category, sectionId] of this.categoryToSectionMap.entries()) {
      const section = initialSections.find(s => s.id === sectionId);
      if (section) {
        mappings.push({ category, sectionId, section });
      }
    }
    
    return mappings;
  }

  /**
   * Updates the mapping between a category and section
   */
  updateCategoryMapping(category: BookCategory, sectionId: string): void {
    const oldSectionId = this.categoryToSectionMap.get(category);
    if (oldSectionId) {
      this.sectionToCategoryMap.delete(oldSectionId);
    }
    
    this.categoryToSectionMap.set(category, sectionId);
    this.sectionToCategoryMap.set(sectionId, category);
  }

  /**
   * Validates that a section exists for the given category
   */
  validateCategoryMapping(category: BookCategory): boolean {
    const sectionId = this.categoryToSectionMap.get(category);
    if (!sectionId) return false;
    
    return initialSections.some(section => section.id === sectionId);
  }

  /**
   * Gets statistics about books per category/section
   */
  getCategoryStats(books: Array<{ category: BookCategory; sectionId: string }>): Map<BookCategory, number> {
    const stats = new Map<BookCategory, number>();
    
    // Initialize all categories with 0
    Object.values(BookCategory).forEach(category => {
      stats.set(category, 0);
    });
    
    // Count books per category
    books.forEach(book => {
      const currentCount = stats.get(book.category) || 0;
      stats.set(book.category, currentCount + 1);
    });
    
    return stats;
  }

  /**
   * Gets section statistics
   */
  getSectionStats(books: Array<{ category: BookCategory; sectionId: string }>): Map<string, number> {
    const stats = new Map<string, number>();
    
    // Initialize all book sections with 0
    this.getBookSections().forEach(section => {
      stats.set(section.id, 0);
    });
    
    // Count books per section
    books.forEach(book => {
      const currentCount = stats.get(book.sectionId) || 0;
      stats.set(book.sectionId, currentCount + 1);
    });
    
    return stats;
  }
}

// Export a singleton instance
export const sectionMappingService = new SectionMappingService();