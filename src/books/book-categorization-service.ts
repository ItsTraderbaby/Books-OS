import { CategoryService, GitHubRepository, CategorizationResult } from './category-service';
import { SectionMappingService, sectionMappingService } from './section-mapping-service';
import { Book, BookCategory } from './types';

export interface BookCategorizationResult {
  category: BookCategory;
  sectionId: string;
  confidence: number;
  matchedRules: string[];
}

/**
 * Main service that handles the complete book categorization workflow
 */
export class BookCategorizationService {
  private categoryService: CategoryService;
  private sectionMappingService: SectionMappingService;

  constructor() {
    this.categoryService = new CategoryService();
    this.sectionMappingService = sectionMappingService;
  }

  /**
   * Categorizes a GitHub repository and assigns it to the appropriate section
   */
  categorizeAndAssignSection(repository: GitHubRepository): BookCategorizationResult {
    // Get category from the categorization engine
    const categorizationResult = this.categoryService.categorizeRepository(repository);
    
    // Get the corresponding section ID
    const sectionId = this.sectionMappingService.getSectionIdForCategory(categorizationResult.category);
    
    return {
      category: categorizationResult.category,
      sectionId,
      confidence: categorizationResult.confidence,
      matchedRules: categorizationResult.matchedRules
    };
  }

  /**
   * Updates an existing book's category and section assignment
   */
  recategorizeBook(book: Book, repository: GitHubRepository): BookCategorizationResult {
    const result = this.categorizeAndAssignSection(repository);
    
    // Update the book's category and section
    book.category = result.category;
    book.sectionId = result.sectionId;
    
    return result;
  }

  /**
   * Batch categorize multiple repositories
   */
  categorizeMultipleRepositories(repositories: GitHubRepository[]): BookCategorizationResult[] {
    return repositories.map(repo => this.categorizeAndAssignSection(repo));
  }

  /**
   * Gets all available categories with their section mappings
   */
  getCategoriesWithSections() {
    return this.categoryService.getCategories().map(category => ({
      ...category,
      sectionId: this.sectionMappingService.getSectionIdForCategory(category.id),
      section: this.sectionMappingService.getSectionForCategory(category.id)
    }));
  }

  /**
   * Validates that a book's category matches its section
   */
  validateBookCategorySection(book: Book): boolean {
    const expectedSectionId = this.sectionMappingService.getSectionIdForCategory(book.category);
    return book.sectionId === expectedSectionId;
  }

  /**
   * Fixes books that have mismatched categories and sections
   */
  fixMismatchedBooks(books: Book[]): Array<{ book: Book; oldSectionId: string; newSectionId: string }> {
    const fixes: Array<{ book: Book; oldSectionId: string; newSectionId: string }> = [];
    
    books.forEach(book => {
      if (!this.validateBookCategorySection(book)) {
        const oldSectionId = book.sectionId;
        const newSectionId = this.sectionMappingService.getSectionIdForCategory(book.category);
        
        book.sectionId = newSectionId;
        fixes.push({ book, oldSectionId, newSectionId });
      }
    });
    
    return fixes;
  }

  /**
   * Gets categorization statistics
   */
  getCategorizationStats(books: Book[]) {
    const categoryStats = this.sectionMappingService.getCategoryStats(books);
    const sectionStats = this.sectionMappingService.getSectionStats(books);
    
    return {
      categoryStats,
      sectionStats,
      totalBooks: books.length,
      categoriesWithBooks: Array.from(categoryStats.entries())
        .filter(([_, count]) => count > 0)
        .length,
      sectionsWithBooks: Array.from(sectionStats.entries())
        .filter(([_, count]) => count > 0)
        .length
    };
  }

  /**
   * Suggests category for a book based on manual input
   */
  suggestCategory(
    name: string, 
    description?: string, 
    language?: string, 
    topics: string[] = [],
    files: string[] = []
  ): CategorizationResult {
    const mockRepository: GitHubRepository = {
      name,
      description,
      language,
      topics,
      files
    };
    
    return this.categoryService.categorizeRepository(mockRepository);
  }

  /**
   * Gets books that need recategorization (low confidence scores)
   */
  getBooksNeedingReview(books: Array<Book & { categorizationConfidence?: number }>): Book[] {
    return books.filter(book => 
      !book.categorizationConfidence || book.categorizationConfidence < 0.6
    );
  }

  /**
   * Manually override a book's category
   */
  overrideBookCategory(book: Book, newCategory: BookCategory): void {
    book.category = newCategory;
    book.sectionId = this.sectionMappingService.getSectionIdForCategory(newCategory);
  }
}

// Export a singleton instance
export const bookCategorizationService = new BookCategorizationService();