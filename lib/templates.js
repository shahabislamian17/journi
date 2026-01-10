import fs from "fs";
import path from "path";

const cache = new Map();

export function readTemplate(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);

  const fullPath = path.join(process.cwd(), "templates", relPath);
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
