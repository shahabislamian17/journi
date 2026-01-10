// Utility to convert HTML strings to JSX-compatible format
// This helps convert class to className and handle other HTML to JSX conversions

export function htmlToJsx(htmlString) {
  if (!htmlString) return '';
  
  // Convert class to className
  let jsx = htmlString.replace(/\bclass=/g, 'className=');
  
  // Convert for to htmlFor (for label elements)
  jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
  
  // Convert self-closing tags that need to be closed in JSX
  jsx = jsx.replace(/<img([^>]*?)(?<!\s\/)>/g, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*?)(?<!\s\/)>/g, '<input$1 />');
  jsx = jsx.replace(/<br([^>]*?)(?<!\s\/)>/g, '<br$1 />');
  jsx = jsx.replace(/<hr([^>]*?)(?<!\s\/)>/g, '<hr$1 />');
  jsx = jsx.replace(/<meta([^>]*?)(?<!\s\/)>/g, '<meta$1 />');
  jsx = jsx.replace(/<link([^>]*?)(?<!\s\/)>/g, '<link$1 />');
  
  return jsx;
}

// Convert HTML template to React component string
export function templateToComponent(htmlString, componentName) {
  const jsx = htmlToJsx(htmlString);
  
  return `export default function ${componentName}() {
  return (
    ${jsx.trim().split('\n').map(line => '    ' + line).join('\n')}
  );
}`;
}

