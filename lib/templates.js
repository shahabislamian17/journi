import fs from "fs";
import path from "path";

const cache = new Map();

// Get templates directory path - works in both local and Vercel
function getTemplatesDir() {
  // In Vercel, __dirname points to the function directory
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), "templates"),
    path.join(__dirname, "..", "templates"),
    path.join(__dirname, "../../templates"),
    "/var/task/templates",
  ];
  
  for (const templatePath of possiblePaths) {
    try {
      if (fs.existsSync(templatePath)) {
        return templatePath;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  // Fallback to process.cwd() if nothing found
  return path.join(process.cwd(), "templates");
}

export function readTemplate(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);

  const templatesDir = getTemplatesDir();
  const fullPath = path.join(templatesDir, relPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Template not found: ${relPath}`);
    console.error(`Templates directory: ${templatesDir}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    throw new Error(`Template not found: ${relPath}`);
  }
  
  const html = fs.readFileSync(fullPath, "utf8");

  cache.set(relPath, html);
  return html;
}

export function readTemplates(relPaths) {
  const out = {};
  relPaths.forEach((p) => (out[p] = readTemplate(p)));
  return out;
}

export function escapeForTemplateLiteral(str) {
  return (str || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}
