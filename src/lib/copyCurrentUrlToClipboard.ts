/**
 * 현재 페이지 URL을 클립보드에 복사합니다. (알림 UI 포함)
 */
export const copyCurrentUrlToClipboard = (): void => {
  if (typeof window === 'undefined' || !window?.location?.href) {
    alert('URL을 복사할 수 없습니다.');
    return;
  }

  const currentUrl = window.location.href;

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert('URL이 복사되었습니다!');
      })
      .catch(() => {
        alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
      });
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = currentUrl;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert('URL이 복사되었습니다!');
    } else {
      alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (err) {
    console.error(err);
    alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
  }

  document.body.removeChild(textArea);
};
