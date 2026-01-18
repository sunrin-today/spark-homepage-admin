import { EventFormState } from "@/lib/types/events";
import { ImageListItem } from "@/lib/types/common";
function isValidURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
function buildCreatePayload(form: EventFormState) {
  return {
    name: form.name,
    description: form.description,
    startedAt: form.startedAt,
    deadline: form.deadline,
    link: form.link,
    isLinkOn: form.isLinkOn,
    thumbnail: form.thumbnail!, // create에서는 필수

    detailImages: form.detailImages
      .filter((i): i is Extract<ImageListItem, { type: "new" }> => i.type === "new")
      .map((i) => i.file),
  };
}
function buildUpdatePayload(
  form: EventFormState,
  initialDetailImages: string[]
) {
  const exists = form.detailImages
    .filter((i): i is Extract<ImageListItem, { type: "exists" }> => i.type === "exists")
    .map((i) => i.url);

  const newImages = form.detailImages
    .filter((i): i is Extract<ImageListItem, { type: "new" }> => i.type === "new")
    .map((i) => i.file);

  const deletes = initialDetailImages.filter(
    (url) => !exists.includes(url)
  );

  return {
    name: form.name,
    description: form.description,
    startedAt: form.startedAt,
    deadline: form.deadline,
    link: form.link,
    isLinkOn: form.isLinkOn,

    thumbnail: form.thumbnail, // null이면 서버에서 유지
    deletes,
    newImages,
  };
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

export { isValidURL, validateEventLink, buildCreatePayload, buildUpdatePayload };