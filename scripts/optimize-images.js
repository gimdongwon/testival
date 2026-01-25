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
const SIZE_THRESHOLD = 1 * 1024 * 1024; // 1MB = 1,048,576 bytes (이 크기 이하는 건너뜀)

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext !== '.png') {
      return;
    }

    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    const originalSizeMB = originalSize / 1024 / 1024;

    // 상대 경로 표시 (images/ 이하 경로)
    const relativePath = path.relative(IMAGES_DIR, filePath);

    // 1MB 이하는 건너뛰기
    if (originalSize <= SIZE_THRESHOLD) {
      // console.log(`⏭️  ${relativePath}`);
      // console.log(`   크기: ${originalSizeMB.toFixed(2)}MB (1MB 이하 - 건너뜀)\n`);
      return;
    }

    // WebP 파일이 이미 존재하는지 확인
    const webpPath = filePath.replace(/\.png$/i, '.webp');
    const webpExists = fs.existsSync(webpPath);

    // WebP가 없으면 생성
    if (!webpExists) {
      await sharp(filePath)
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      const webpSize = webpStats.size;
      console.log(`📦 WebP 생성: ${relativePath.replace('.png', '.webp')} (${(webpSize / 1024 / 1024).toFixed(2)}MB)`);
    }

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

    // 압축된 파일이 원본보다 작은 경우에만 교체
    const tempStats = fs.statSync(tempPath);
    const newPngSize = tempStats.size;

    if (newPngSize < originalSize) {
      fs.renameSync(tempPath, filePath);
      console.log(`✅ ${relativePath}`);
      console.log(`   원본: ${originalSizeMB.toFixed(2)}MB → 압축: ${(newPngSize / 1024 / 1024).toFixed(2)}MB (${((1 - newPngSize / originalSize) * 100).toFixed(1)}% 감소)`);
    } else {
      // 압축해도 더 크거나 비슷하면 원본 유지
      fs.unlinkSync(tempPath);
      // console.log(`⏭️  ${relativePath}`);
      // console.log(`   원본: ${originalSizeMB.toFixed(2)}MB (압축 효과 없음 - 원본 유지)\n`);
      return;
    }

    // WebP 정보 출력
    if (webpExists) {
      const webpStats = fs.statSync(webpPath);
      const webpSize = webpStats.size;
      console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (기존 파일)\n`);
    } else {
      const webpStats = fs.statSync(webpPath);
      const webpSize = webpStats.size;
      console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (${((1 - webpSize / originalSize) * 100).toFixed(1)}% 감소)\n`);
    }
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
  console.log(`📏 크기 임계값: ${SIZE_THRESHOLD / 1024 / 1024}MB (이하는 건너뜀)\n`);
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ 이미지 디렉토리를 찾을 수 없습니다: ${IMAGES_DIR}`);
    process.exit(1);
  }

  await walkDirectory(IMAGES_DIR);
  
  console.log('\n✨ 이미지 최적화 완료!');
  console.log('💡 Next.js는 자동으로 WebP 파일을 우선 사용합니다.');
  console.log('💡 1MB 이하의 파일은 건너뛰었습니다.');
}

main().catch(console.error);
