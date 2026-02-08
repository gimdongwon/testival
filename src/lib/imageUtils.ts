// src/lib/imageUtils.ts

/** .png 경로를 .webp로 변환 */
export const toWebP = (path: string): string =>
  path.replace(/\.png$/i, '.webp');

/**
 * PNG 경로를 WebP로 해석합니다 (사용 가능한 경우에만).
 * webpFiles 배열에 해당 .webp 파일명이 포함되어 있으면 .webp 경로를,
 * 없으면 원래 .png 경로를 반환합니다.
 *
 * 서버에서 getAvailableWebP()로 목록을 구해 클라이언트에 전달하면
 * 404 없이 webp/png를 결정할 수 있습니다.
 */
export const resolveImage = (
  pngPath: string,
  webpFiles: string[]
): string => {
  const filename = pngPath.split('/').pop()?.replace(/\.png$/i, '.webp');
  if (filename && webpFiles.includes(filename)) {
    return toWebP(pngPath);
  }
  return pngPath;
};
