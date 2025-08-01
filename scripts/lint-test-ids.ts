#!/usr/bin/env tsx

/**
 * Test ID Linter for CapOpt Platform
 * 
 * This script validates that all data-testid values in the codebase
 * are imported from the centralized testSelectors.ts file.
 * 
 * Usage:
 *   npm run lint:test-ids
 *   npm run lint:test-ids --fix
 */

import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

// Import test IDs from the centralized file
import { testIds, isValidTestId } from '../lib/testSelectors';

interface LintResult {
  file: string;
  line: number;
  column: number;
  testId: string;
  isValid: boolean;
  suggestion?: string;
}

class TestIdLinter {
  private results: LintResult[] = [];
  private shouldFix: boolean = false;

  constructor(private shouldAutoFix: boolean = false) {
    this.shouldFix = shouldAutoFix;
  }

  /**
   * Run the linter across all TypeScript and TSX files
   */
  async run(): Promise<void> {
    console.log('🔍 Scanning for test IDs...\n');

    // Find all TypeScript and TSX files
    const files = await glob('**/*.{ts,tsx}', {
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'build/**',
        'coverage/**',
        'lib/testSelectors.ts', // Skip the test selectors file itself
        'scripts/lint-test-ids.ts', // Skip this script
      ]
    });

    console.log(`📁 Found ${files.length} files to scan\n`);

    // Process each file
    for (const file of files) {
      await this.processFile(file);
    }

    // Report results
    this.reportResults();
  }

  /**
   * Process a single file for test ID validation
   */
  private async processFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Check if file imports test IDs
      const hasTestIdImport = this.hasTestIdImport(content);

      // Find all data-testid occurrences
      const testIdRegex = /data-testid\s*=\s*["'`]([^"'`]+)["'`]/g;
      let match;

      while ((match = testIdRegex.exec(content)) !== null) {
        const testId = match[1];
        const lineNumber = this.getLineNumber(content, match.index);
        const columnNumber = this.getColumnNumber(content, match.index);

        const isValid = isValidTestId(testId);
        const suggestion = this.getSuggestion(testId, hasTestIdImport);

        this.results.push({
          file: filePath,
          line: lineNumber,
          column: columnNumber,
          testId,
          isValid,
          suggestion
        });

        // Auto-fix if enabled
        if (this.shouldFix && !isValid && suggestion) {
          await this.autoFix(filePath, testId, suggestion);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }

  /**
   * Check if file imports test IDs from the centralized file
   */
  private hasTestIdImport(content: string): boolean {
    const importPatterns = [
      /import.*testSelectors.*from.*['"`]@\/lib\/testSelectors['"`]/,
      /import.*testSelectors.*from.*['"`]\.\.\/lib\/testSelectors['"`]/,
      /import.*testSelectors.*from.*['"`]\.\/lib\/testSelectors['"`]/,
      /import.*\{.*\}.*from.*['"`]@\/lib\/testSelectors['"`]/,
      /import.*\{.*\}.*from.*['"`]\.\.\/lib\/testSelectors['"`]/,
      /import.*\{.*\}.*from.*['"`]\.\/lib\/testSelectors['"`]/,
    ];

    return importPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Get line number from character index
   */
  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Get column number from character index
   */
  private getColumnNumber(content: string, index: number): number {
    const lines = content.substring(0, index).split('\n');
    const lastLine = lines[lines.length - 1];
    return lastLine.length + 1;
  }

  /**
   * Get suggestion for invalid test ID
   */
  private getSuggestion(testId: string, hasImport: boolean): string | undefined {
    if (isValidTestId(testId)) {
      return undefined;
    }

    // Find similar test IDs
    const similarIds = Object.values(testIds).filter(id => 
      id.includes(testId.split('-').slice(-1)[0]) || // Match last part
      testId.includes(id.split('-').slice(-1)[0])    // Match last part
    );

    if (similarIds.length > 0) {
      const suggestion = similarIds[0];
      if (hasImport) {
        return `Use ${suggestion} instead`;
      } else {
        return `Import and use ${suggestion} from @/lib/testSelectors`;
      }
    }

    if (!hasImport) {
      return 'Import test IDs from @/lib/testSelectors';
    }

    return 'Add this test ID to lib/testSelectors.ts';
  }

  /**
   * Auto-fix invalid test IDs
   */
  private async autoFix(filePath: string, oldTestId: string, suggestion: string): Promise<void> {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Find similar test ID to use
      const similarIds = Object.values(testIds).filter(id => 
        id.includes(oldTestId.split('-').slice(-1)[0]) ||
        oldTestId.includes(id.split('-').slice(-1)[0])
      );

      if (similarIds.length > 0) {
        const newTestId = similarIds[0];
        content = content.replace(
          new RegExp(`data-testid\\s*=\\s*["'\`]${oldTestId}["'\`]`, 'g'),
          `data-testid="${newTestId}"`
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Auto-fixed ${filePath}: ${oldTestId} → ${newTestId}`);
      }
    } catch (error) {
      console.error(`❌ Error auto-fixing ${filePath}:`, error);
    }
  }

  /**
   * Report linting results
   */
  private reportResults(): void {
    const validResults = this.results.filter(r => r.isValid);
    const invalidResults = this.results.filter(r => !r.isValid);

    console.log('📊 Test ID Linting Results:\n');

    if (validResults.length > 0) {
      console.log(`✅ ${validResults.length} valid test IDs found`);
    }

    if (invalidResults.length > 0) {
      console.log(`❌ ${invalidResults.length} invalid test IDs found:\n`);

      // Group by file for better readability
      const groupedResults = this.groupByFile(invalidResults);

      for (const [file, results] of Object.entries(groupedResults)) {
        console.log(`📁 ${file}:`);
        for (const result of results) {
          console.log(`   Line ${result.line}:${result.column} - "${result.testId}"`);
          if (result.suggestion) {
            console.log(`   💡 Suggestion: ${result.suggestion}`);
          }
        }
        console.log('');
      }

      console.log('🔧 To fix automatically, run: npm run lint:test-ids --fix');
    } else {
      console.log('🎉 All test IDs are valid!');
    }

    // Exit with error code if there are invalid results
    if (invalidResults.length > 0) {
      process.exit(1);
    }
  }

  /**
   * Group results by file
   */
  private groupByFile(results: LintResult[]): Record<string, LintResult[]> {
    return results.reduce((acc, result) => {
      if (!acc[result.file]) {
        acc[result.file] = [];
      }
      acc[result.file].push(result);
      return acc;
    }, {} as Record<string, LintResult[]>);
  }

  /**
   * Generate a summary report
   */
  generateSummary(): void {
    const totalFiles = new Set(this.results.map(r => r.file)).size;
    const totalTestIds = this.results.length;
    const validTestIds = this.results.filter(r => r.isValid).length;
    const invalidTestIds = this.results.filter(r => !r.isValid).length;

    console.log('\n📈 Summary:');
    console.log(`   Files scanned: ${totalFiles}`);
    console.log(`   Total test IDs: ${totalTestIds}`);
    console.log(`   Valid test IDs: ${validTestIds}`);
    console.log(`   Invalid test IDs: ${invalidTestIds}`);
    console.log(`   Success rate: ${((validTestIds / totalTestIds) * 100).toFixed(1)}%`);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  console.log('🧭 CapOpt Platform - Test ID Linter\n');

  const linter = new TestIdLinter(shouldFix);
  await linter.run();
  linter.generateSummary();
}

// Run the linter
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Linter failed:', error);
    process.exit(1);
  });
}

export { TestIdLinter }; 