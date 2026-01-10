#!/usr/bin/env node

/**
 * Script to convert HTML templates to JSX React components
 * Usage: node scripts/convert-html-to-jsx.js <template-path>
 * 
 * This script:
 * 1. Reads HTML template file
 * 2. Converts class to className
 * 3. Converts readonly to readOnly
 * 4. Converts for to htmlFor
 * 5. Ensures self-closing tags are properly formatted
 * 6. Creates a React component file
 */

const fs = require('fs');
const path = require('path');

function htmlToJsx(htmlContent) {
  let jsx = htmlContent;
  
  // Convert class to className
  jsx = jsx.replace(/\bclass=/g, 'className=');
  
  // Convert readonly to readOnly
  jsx = jsx.replace(/\breadonly\b/g, 'readOnly');
  
  // Convert for to htmlFor (for label elements)
  jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
  
  // Convert self-closing tags
  jsx = jsx.replace(/<img([^>]*?)(?<!\s\/)>/g, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*?)(?<!\s\/)>/g, '<input$1 />');
  jsx = jsx.replace(/<br([^>]*?)(?<!\s\/)>/g, '<br$1 />');
  jsx = jsx.replace(/<hr([^>]*?)(?<!\s\/)>/g, '<hr$1 />');
  jsx = jsx.replace(/<meta([^>]*?)(?<!\s\/)>/g, '<meta$1 />');
  jsx = jsx.replace(/<link([^>]*?)(?<!\s\/)>/g, '<link$1 />');
  
  // Remove Vue.js specific attributes (like :value, v-if, etc.)
  jsx = jsx.replace(/:value="[^"]*"/g, '');
  jsx = jsx.replace(/v-if="[^"]*"/g, '');
  jsx = jsx.replace(/v-for="[^"]*"/g, '');
  jsx = jsx.replace(/v-model="[^"]*"/g, '');
  
  // Remove Vue component tags (like <dates>)
  jsx = jsx.replace(/<dates[^>]*>.*?<\/dates>/gs, '{/* Dates component */}');
  
  return jsx;
}

function toComponentName(filePath) {
  const fileName = path.basename(filePath, '.html');
  // Convert kebab-case to PascalCase
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function createComponent(htmlPath, outputDir) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsxContent = htmlToJsx(htmlContent);
  const componentName = toComponentName(htmlPath);
  
  const componentCode = `export default function ${componentName}() {
  return (
${jsxContent.split('\n').map(line => '    ' + line).join('\n')}
  );
}
`;

  // Determine output path
  const relativePath = path.relative(
    path.join(process.cwd(), 'templates'),
    htmlPath
  );
  const outputPath = path.join(
    outputDir,
    path.dirname(relativePath),
    `${componentName}.js`
  );
  
  // Create directory if it doesn't exist
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // Write component file
  fs.writeFileSync(outputPath, componentCode);
  
  console.log(`✅ Created: ${outputPath}`);
  return outputPath;
}

// Main execution
if (require.main === module) {
  const templatePath = process.argv[2];
  const outputDir = process.argv[3] || path.join(process.cwd(), 'components', 'layouts');
  
  if (!templatePath) {
    console.error('Usage: node scripts/convert-html-to-jsx.js <template-path> [output-dir]');
    process.exit(1);
  }
  
  const fullPath = path.isAbsolute(templatePath) 
    ? templatePath 
    : path.join(process.cwd(), templatePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found: ${fullPath}`);
    process.exit(1);
  }
  
  createComponent(fullPath, outputDir);
}

module.exports = { htmlToJsx, createComponent, toComponentName };

