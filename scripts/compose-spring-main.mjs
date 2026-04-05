#!/usr/bin/env node
/**
 * Figma MCP 에셋 URL로 랜딩 메인(1165:374)과 동일 구성을 합성합니다.
 * (FIGMA_ACCESS_TOKEN 없이 동작 — 텍스트는 AppleGothic으로 렌더)
 *
 * node scripts/compose-spring-main.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public/images/quiz/spring');

/** get_design_context(1165:374) 기준 MCP 에셋 (갱신 시 Figma에서 다시 확인) */
const ASSETS = {
  cherry: 'https://www.figma.com/api/mcp/asset/df4f6644-e854-434a-8cf3-48ee51c1fd12',
  character: 'https://www.figma.com/api/mcp/asset/f11e1afa-aabd-4033-9fe5-a25e23ebe057',
  ellipseFrame: 'https://www.figma.com/api/mcp/asset/87e7a050-bcbe-4c60-a7be-e20fbd2afc51',
  mask: 'https://www.figma.com/api/mcp/asset/c98e0ea8-588d-4e27-8d53-9b8cb96966d4',
};

/** 노드 1205:835 — OG용 벚꽃 프레임 */
const OG_ASSET =
  'https://www.figma.com/api/mcp/asset/bb8a40be-0a08-41aa-a1fd-4e84479a0108';

const W = 375;
const H = 812;

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  console.log('에셋 다운로드…');
  const [cherryBuf, charBuf, ellipseBuf, maskBuf, ogBuf] = await Promise.all([
    fetchBuf(ASSETS.cherry),
    fetchBuf(ASSETS.character),
    fetchBuf(ASSETS.ellipseFrame),
    fetchBuf(ASSETS.mask),
    fetchBuf(OG_ASSET),
  ]);

  const gradientSvg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fdbef7"/>
          <stop offset="100%" stop-color="#87f1fe"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`
  );

  const base = await sharp(gradientSvg).png().toBuffer();

  const cherry = sharp(cherryBuf);
  const cherryMeta = await cherry.metadata();
  const cw = cherryMeta.width ?? 1024;
  const ch = cherryMeta.height ?? 1329;

  const cropLeft = 325;
  const cropTop = 258;
  const cherryCropped = await cherry
    .extract({
      left: Math.min(cropLeft, Math.max(0, cw - W)),
      top: Math.min(cropTop, Math.max(0, ch - H)),
      width: Math.min(W, cw - cropLeft),
      height: Math.min(H, ch - cropTop),
    })
    .resize(W, H, { fit: 'fill' })
    .png()
    .toBuffer();

  const whiteOverlay = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0.2 },
    },
  })
    .png()
    .toBuffer();

  const titleSvg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="187.5" y="118" text-anchor="middle" font-size="40" font-weight="700" font-family="AppleGothic" fill="#4e474f">
        <tspan x="187.5" dy="0">봄 나들이,</tspan>
        <tspan x="187.5" dy="44">어디로 가지?</tspan>
      </text>
      <text x="187.5" y="200" text-anchor="middle" font-size="20" font-family="AppleGothic" fill="#4e474f">
        벚꽃 엔딩 5분 전! 추천 나들이 코스
      </text>
    </svg>`
  );
  const textLayer = await sharp(titleSvg).png().toBuffer();

  /** 마스크(304×370)와 동일 크기로 cover 후, 타원 마스크로 클립 */
  const innerW = 304;
  const innerH = 370;

  const maskedSized = await sharp(charBuf)
    .resize(innerW, innerH, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .composite([
      {
        input: await sharp(maskBuf)
          .resize(innerW, innerH, { fit: 'fill' })
          .ensureAlpha()
          .toBuffer(),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const ellipseSized = await sharp(ellipseBuf)
    .resize(320, 383, { fit: 'fill' })
    .png()
    .toBuffer();

  const leftMain = Math.round((W - 350) / 2);
  const topMain = 222;
  const leftInner = Math.round(leftMain + (350 - innerW) / 2);
  const topInner = topMain + 10;

  const leftEllipse = Math.round(leftMain + (350 - 320) / 2);
  const topEllipse = topMain + 3;

  let composite = await sharp(base)
    .composite([
      { input: cherryCropped, left: 0, top: 0 },
      { input: whiteOverlay, left: 0, top: 0 },
      { input: textLayer, left: 0, top: 0 },
      { input: maskedSized, left: leftInner, top: topInner },
      { input: ellipseSized, left: leftEllipse, top: topEllipse },
    ])
    .png()
    .toBuffer();

  const mainPath = path.join(OUT, 'main.png');
  fs.writeFileSync(mainPath, composite);
  console.log('saved', mainPath, fs.statSync(mainPath).size, 'bytes');

  const ogPath = path.join(OUT, 'og-image.png');
  await sharp(ogBuf)
    .resize(1200, 630, {
      fit: 'contain',
      position: 'centre',
      background: { r: 249, g: 244, b: 238 },
    })
    .png()
    .toFile(ogPath);
  console.log(
    'saved',
    ogPath,
    fs.statSync(ogPath).size,
    'bytes (1205:835 에셋 → 1200×630 contain, 크롭 없음)'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
