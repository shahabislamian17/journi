#!/usr/bin/env node

/**
 * Script to fix template imports in pages
 * Converts static imports to dynamic imports to avoid fs module issues
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pagesDir = path.join(process.cwd(), 'pages');

// Find all page files
const pageFiles = glob.sync('**/*.js', { cwd: pagesDir, absolute: true });

pageFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file imports from lib/templates
  if (content.includes("from") && content.includes("lib/templates")) {
    // Replace static import with dynamic import pattern
    const staticImportPattern = /import\s*\{[^}]*readTemplates[^}]*escapeForTemplateLiteral[^}]*\}\s*from\s*["']([^"']*lib\/templates)["'];?/g;
    const staticImportPattern2 = /import\s*\{[^}]*escapeForTemplateLiteral[^}]*readTemplates[^}]*\}\s*from\s*["']([^"']*lib\/templates)["'];?/g;
    
    // Remove static import
    if (staticImportPattern.test(content) || staticImportPattern2.test(content)) {
      content = content.replace(staticImportPattern, '');
      content = content.replace(staticImportPattern2, '');
      
      // Add escapeForTemplateLiteral import from utils
      if (!content.includes("from '../lib/utils'") && !content.includes("from './lib/utils'")) {
        const importLine = content.match(/^import .* from ["']/m);
        if (importLine) {
          const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'lib', 'utils.js'))
            .replace(/\\/g, '/')
            .replace(/^\.\.\//, '../')
            .replace(/^\.\//, './');
          content = content.replace(
            /(import .* from ["'][^"']*["'];?\n)/,
            `$1import { escapeForTemplateLiteral } from "${relativePath}";\n`
          );
        }
      }
      
      // Find getStaticProps or getServerSideProps and add dynamic import
      const propsFunctionPattern = /(export\s+async\s+function\s+(getStaticProps|getServerSideProps)\s*\([^)]*\)\s*\{)/;
      if (propsFunctionPattern.test(content)) {
        content = content.replace(
          propsFunctionPattern,
          `$1\n  // Dynamic import to ensure this only runs on the server\n  const { readTemplates } = await import("${path.relative(path.dirname(filePath), path.join(process.cwd(), 'lib', 'templates.js')).replace(/\\/g, '/').replace(/^\.\.\//, '../').replace(/^\.\//, './')}");`
        );
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Done!');

