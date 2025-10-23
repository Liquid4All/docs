import fs from 'fs';
import path from 'path';

export async function getFileContent(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  return fs.readFileSync(fullPath, 'utf8');
}

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)(\n)*---\s*(\n|$)/;

export function stripFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_REGEX, '').trim();
}
