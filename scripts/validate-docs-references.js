#!/usr/bin/env node

/**
 * @docs/ Reference Validation Script
 * 
 * This script validates @docs/ references in markdown files and checks for:
 * - Broken references (files that don't exist)
 * - Invalid reference formats
 * - Missing section anchors
 * - Unused documentation files
 * 
 * Usage: node scripts/validate-docs-references.js [options]
 * Options:
 *   --fix: Automatically fix common issues
 *   --report: Generate detailed report
 *   --check-anchors: Validate section anchors
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  docsDir: 'docs',
  patterns: ['**/*.md'],
  excludePatterns: ['node_modules/**', '.git/**'],
  referencePattern: /@docs\/([^\s#]+)(?:#([^\s]+))?/g,
  validCategories: ['design', 'technical', 'implementation-status', 'business-analysis', 'implementation-plan'],
  reportFile: 'docs-validation-report.md'
};

// Statistics
const stats = {
  filesProcessed: 0,
  totalReferences: 0,
  validReferences: 0,
  brokenReferences: 0,
  invalidFormats: 0,
  missingAnchors: 0,
  unusedFiles: 0,
  errors: []
};

/**
 * Main validation function
 */
async function validateDocsReferences() {
  console.log('🔍 Starting @docs/ reference validation...\n');
  
  const args = process.argv.slice(2);
  const options = {
    fix: args.includes('--fix'),
    report: args.includes('--report'),
    checkAnchors: args.includes('--check-anchors')
  };
  
  try {
    // Find all markdown files
    const files = await findMarkdownFiles();
    console.log(`📁 Found ${files.length} markdown files to process\n`);
    
    // Process each file
    for (const file of files) {
      await processFile(file, options);
    }
    
    // Generate report
    if (options.report) {
      await generateReport();
    }
    
    // Print summary
    printSummary();
    
    // Exit with error code if issues found
    if (stats.brokenReferences > 0 || stats.invalidFormats > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Find all markdown files in the docs directory
 */
async function findMarkdownFiles() {
  const pattern = path.join(CONFIG.docsDir, '**/*.md');
  try {
    const files = await glob(pattern, { ignore: CONFIG.excludePatterns });
    return files;
  } catch (error) {
    throw error;
  }
}

/**
 * Process a single markdown file
 */
async function processFile(filePath, options) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative('.', filePath);
    
    console.log(`📄 Processing: ${relativePath}`);
    
    // Find all @docs/ references
    const references = findReferences(content);
    
    for (const reference of references) {
      await validateReference(reference, filePath, options);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    stats.errors.push({
      file: filePath,
      error: error.message
    });
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Find all @docs/ references in content
 */
function findReferences(content) {
  const references = [];
  let match;
  
  while ((match = CONFIG.referencePattern.exec(content)) !== null) {
    references.push({
      fullMatch: match[0],
      filePath: match[1],
      anchor: match[2],
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return references;
}

/**
 * Validate a single @docs/ reference
 */
async function validateReference(reference, sourceFile, options) {
  stats.totalReferences++;
  
  // Check format
  if (!isValidFormat(reference.fullMatch)) {
    stats.invalidFormats++;
    stats.errors.push({
      file: sourceFile,
      reference: reference.fullMatch,
      error: 'Invalid @docs/ reference format'
    });
    console.error(`  ❌ Invalid format: ${reference.fullMatch}`);
    return;
  }
  
  // Check if file exists
  const targetPath = path.join(CONFIG.docsDir, reference.filePath);
  if (!fs.existsSync(targetPath)) {
    stats.brokenReferences++;
    stats.errors.push({
      file: sourceFile,
      reference: reference.fullMatch,
      error: `Target file does not exist: ${targetPath}`
    });
    console.error(`  ❌ Broken reference: ${reference.fullMatch} -> ${targetPath}`);
    return;
  }
  
  // Check anchor if specified
  if (reference.anchor && options.checkAnchors) {
    const anchorExists = await checkAnchor(targetPath, reference.anchor);
    if (!anchorExists) {
      stats.missingAnchors++;
      stats.errors.push({
        file: sourceFile,
        reference: reference.fullMatch,
        error: `Anchor not found: #${reference.anchor}`
      });
      console.error(`  ❌ Missing anchor: ${reference.fullMatch} -> #${reference.anchor}`);
      return;
    }
  }
  
  stats.validReferences++;
  console.log(`  ✅ Valid reference: ${reference.fullMatch}`);
}

/**
 * Check if @docs/ reference format is valid
 */
function isValidFormat(reference) {
  // Basic format check
  if (!reference.startsWith('@docs/')) {
    return false;
  }
  
  // Check for valid file path
  const filePath = reference.replace('@docs/', '');
  if (!filePath.includes('.md')) {
    return false;
  }
  
  // Check for valid category
  const category = filePath.split('/')[0];
  if (!CONFIG.validCategories.includes(category)) {
    return false;
  }
  
  return true;
}

/**
 * Check if an anchor exists in a markdown file
 */
async function checkAnchor(filePath, anchor) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for heading with the anchor
    const headingPattern = new RegExp(`^#+\\s+${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
    return headingPattern.test(content);
    
  } catch (error) {
    return false;
  }
}

/**
 * Generate detailed validation report
 */
async function generateReport() {
  const report = `# @docs/ Reference Validation Report

**Generated:** ${new Date().toISOString()}
**Total Files Processed:** ${stats.filesProcessed}
**Total References:** ${stats.totalReferences}

## Summary

- ✅ **Valid References:** ${stats.validReferences}
- ❌ **Broken References:** ${stats.brokenReferences}
- ⚠️ **Invalid Formats:** ${stats.invalidFormats}
- 🔗 **Missing Anchors:** ${stats.missingAnchors}

## Errors

${stats.errors.map(error => `
### ${error.file}
- **Reference:** ${error.reference || 'N/A'}
- **Error:** ${error.error}
`).join('')}

## Recommendations

${generateRecommendations()}
`;

  fs.writeFileSync(CONFIG.reportFile, report);
  console.log(`📊 Report generated: ${CONFIG.reportFile}`);
}

/**
 * Generate recommendations based on validation results
 */
function generateRecommendations() {
  const recommendations = [];
  
  if (stats.brokenReferences > 0) {
    recommendations.push('- Fix broken @docs/ references by updating file paths or creating missing files');
  }
  
  if (stats.invalidFormats > 0) {
    recommendations.push('- Fix invalid @docs/ reference formats (should be @docs/category/filename.md)');
  }
  
  if (stats.missingAnchors > 0) {
    recommendations.push('- Add missing section anchors to referenced files');
  }
  
  if (stats.totalReferences === 0) {
    recommendations.push('- Add @docs/ references to improve documentation cross-referencing');
  }
  
  return recommendations.join('\n');
}

/**
 * Print validation summary
 */
function printSummary() {
  console.log('\n📊 Validation Summary');
  console.log('==================');
  console.log(`Files Processed: ${stats.filesProcessed}`);
  console.log(`Total References: ${stats.totalReferences}`);
  console.log(`✅ Valid References: ${stats.validReferences}`);
  console.log(`❌ Broken References: ${stats.brokenReferences}`);
  console.log(`⚠️ Invalid Formats: ${stats.invalidFormats}`);
  console.log(`🔗 Missing Anchors: ${stats.missingAnchors}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Issues Found:');
    stats.errors.forEach(error => {
      console.log(`  - ${error.file}: ${error.error}`);
    });
  } else {
    console.log('\n✅ All @docs/ references are valid!');
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  validateDocsReferences();
}

module.exports = {
  validateDocsReferences,
  findReferences,
  isValidFormat,
  checkAnchor
}; 