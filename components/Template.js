import { createElement } from 'react';

export default function Template({ html = "" }) {
  if (!html || html.trim() === '') {
    return null;
  }

  const trimmedHtml = html.trim();
  const isSection = trimmedHtml.startsWith('<section');
  const isHeader = trimmedHtml.startsWith('<header');
  const isFooter = trimmedHtml.startsWith('<footer');
  
  if (isSection || isHeader || isFooter) {
    // Extract tag name
    let tagName = 'section';
    if (isHeader) tagName = 'header';
    if (isFooter) tagName = 'footer';
    
    // Parse attributes from opening tag
    const tagMatch = trimmedHtml.match(new RegExp(`<${tagName}([^>]*)>`));
    const attributes = {};
    
    if (tagMatch && tagMatch[1]) {
      // Parse attributes from the tag
      const attrString = tagMatch[1];
      // Extract class attribute
      const classMatch = attrString.match(/class=["']([^"']+)["']/);
      if (classMatch) {
        attributes.className = classMatch[1];
      }
      // Extract other common attributes (id, data-*, etc.)
      const idMatch = attrString.match(/id=["']([^"']+)["']/);
      if (idMatch) {
        attributes.id = idMatch[1];
      }
      // Extract data attributes
      const dataMatches = attrString.matchAll(/data-(\w+(?:-\w+)*)=["']([^"']+)["']/g);
      for (const match of dataMatches) {
        attributes[`data-${match[1]}`] = match[2];
      }
    }
    
    // Extract inner HTML (content between opening and closing tags)
    const innerHtmlMatch = trimmedHtml.match(new RegExp(`<${tagName}[^>]*>(.*)</${tagName}>`, 's'));
    const innerHtml = innerHtmlMatch ? innerHtmlMatch[1] : '';
    
    // Render the element directly without any wrapper - use dangerouslySetInnerHTML on the element itself
    return createElement(tagName, { ...attributes, dangerouslySetInnerHTML: { __html: innerHtml } });
  }
  
  // For other content, use a regular div wrapper
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
