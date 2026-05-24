import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GuideZ, type Guide } from '@/domain/guide.schema';

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

export async function listGuides(): Promise<Guide[]> {
  let files: string[];
  try {
    files = await fs.readdir(GUIDES_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const guides: Guide[] = [];
  for (const f of files) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    const raw = await fs.readFile(path.join(GUIDES_DIR, f), 'utf-8');
    const parsed = GuideZ.parse(JSON.parse(raw));
    guides.push(parsed);
  }
  return guides.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const filePath = path.join(GUIDES_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return GuideZ.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}
