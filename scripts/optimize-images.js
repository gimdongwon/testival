/**
 * 이미지 최적화 스크립트
 * PNG 파일을 WebP로 변환하고 압축합니다.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const QUALITY = 85; // WebP 품질 (1-100)
const PNG_QUALITY = 85; // PNG 품질

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext !== '.png') {
      return;
    }

    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    // WebP 파일 생성
    const webpPath = filePath.replace(/\.png$/i, '.webp');
    
    await sharp(filePath)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    const webpSize = webpStats.size;

    // PNG 파일도 압축
    const tempPath = filePath + '.temp';
    await sharp(filePath)
      .png({ 
        quality: PNG_QUALITY, 
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      })
      .toFile(tempPath);

    // 원본을 압축된 파일로 교체
    fs.renameSync(tempPath, filePath);
    const newPngStats = fs.statSync(filePath);
    const newPngSize = newPngStats.size;

    console.log(`✅ ${path.basename(filePath)}`);
    console.log(`   원본 PNG: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   압축 PNG: ${(newPngSize / 1024 / 1024).toFixed(2)}MB (${((1 - newPngSize / originalSize) * 100).toFixed(1)}% 감소)`);
    console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (${((1 - webpSize / originalSize) * 100).toFixed(1)}% 감소)`);
  } catch (error) {
    console.error(`❌ ${filePath} 처리 실패:`, error.message);
  }
}

async function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walkDirectory(filePath);
    } else if (stat.isFile()) {
      await optimizeImage(filePath);
    }
  }
}

async function main() {
  console.log('🚀 이미지 최적화 시작...\n');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ 이미지 디렉토리를 찾을 수 없습니다: ${IMAGES_DIR}`);
    process.exit(1);
  }

  await walkDirectory(IMAGES_DIR);
  
  console.log('\n✨ 이미지 최적화 완료!');
  console.log('💡 Next.js는 자동으로 WebP 파일을 우선 사용합니다.');
}

main().catch(console.error);
