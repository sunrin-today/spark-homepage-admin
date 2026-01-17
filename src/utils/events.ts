function isValidURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function validateEventLink(link: string): boolean {
  if (!link) {
    alert('링크를 입력해주세요');
    return false;
  }
  if (!isValidURL(link)) {
    alert('유효한 URL을 입력해주세요');
    return false;
  }
  return true;
}

export { isValidURL, validateEventLink };