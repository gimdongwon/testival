#!/usr/bin/env node
/**
 * Figma Images API로 노드를 PNG로 내보내 저장합니다.
 *
 * 사용: FIGMA_ACCESS_TOKEN=xxx node scripts/download-spring-figma-images.mjs
 * 또는: node --env-file=.env.local scripts/download-spring-figma-images.mjs
 *
 * 토큰: Figma → Settings → Personal access tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public/images/quiz/spring');

const FILE_KEY = 'beJAAoFDBWTK3VAxBj8alD';
const API = 'https://api.figma.com/v1';

/** node-id URL 형식 → API ids (1165-374 → 1165:374) */
const toFigmaId = (dashId) => dashId.replace(/-/g, ':');

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error(
    'FIGMA_ACCESS_TOKEN이 없습니다. Figma 설정에서 Personal access token을 발급한 뒤:\n' +
      '  FIGMA_ACCESS_TOKEN=... node scripts/download-spring-figma-images.mjs\n' +
      '또는 node --env-file=.env.local ...'
  );
  process.exit(1);
}

async function fetchImageUrls(nodeIds) {
  const ids = nodeIds.map(toFigmaId).join(',');
  const url = `${API}/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Figma images API ${res.status}: ${t}`);
  }
  const json = await res.json();
  return json.images ?? {};
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  console.log('saved', destPath, `(${buf.length} bytes)`);
}

async function main() {
  const mainNode = '1165-374';
  const ogNode = '1205-835';

  console.log('Figma images API 요청 중…');
  const images = await fetchImageUrls([mainNode, ogNode]);

  const mainUrl = images[toFigmaId(mainNode)];
  const ogUrl = images[toFigmaId(ogNode)];

  if (!mainUrl) throw new Error(`메인 노드 ${mainNode} URL 없음: ${JSON.stringify(images)}`);
  if (!ogUrl) throw new Error(`OG 노드 ${ogNode} URL 없음: ${JSON.stringify(images)}`);

  await downloadFile(mainUrl, path.join(OUT_DIR, 'main.png'));
  await downloadFile(ogUrl, path.join(OUT_DIR, 'og-image.png'));

  console.log('완료: main.png (텍스트 포함 전체 프레임), og-image.png (1205:835)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
