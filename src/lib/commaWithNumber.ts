export function commaWithNumber(value: number | string): string {
  if (value === null || value === undefined || value === '') return '0';

  // 문자열 입력 시 숫자만 추출 (ex. '₩12,000' → 12000)
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(numeric)) return '0';

  return numeric.toLocaleString('ko-KR');
}
