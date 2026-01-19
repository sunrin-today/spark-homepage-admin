import { EventFormState } from "@/lib/types/events";
import { FormImageListItem, ImageItem } from "@/lib/types/common";
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
      .filter((i): i is Extract<FormImageListItem, { type: "new" }> => i && i.type === "new")
      .map((i) => i.file),
  };
}
function buildUpdatePayload(
  form: EventFormState,
  initialDetailImages: ImageItem[]
) {
  const exists = form.detailImages
  .map((item, index) =>
    item?.type === "exists"
      ? { url: item.url, index }
      : null
  )
  .filter((i): i is { url: string; index: number } => i !== null);

 const imageIndexes = form.detailImages
  .map((item, index) => (item?.type === "new" ? index : null))
  .filter((i): i is number => i !== null);
 const newImages = form.detailImages
  .filter((i): i is NonNullable<typeof i> => i !== null)  
  .filter((i): i is Extract<FormImageListItem, { type: "new" }> => i.type === "new")
  .map((i) => i.file);


  const deletes: string[] = initialDetailImages.filter( 
    (item) => !exists.some((existing) => existing.url === item.url)
  ).map((item) => item.url); // {url, index}에서 url만 추출
  
  console.log("exists", exists)
  console.log("deletes", deletes)
  console.log("imageIndexes", imageIndexes);
  return {
    name: form.name,
    description: form.description,
    startedAt: form.startedAt,
    deadline: form.deadline,
    link: form.link,
    isLinkOn: form.isLinkOn,

    thumbnail: form.thumbnail, // null이면 서버에서 유지
    deletes,
    exists,
    imageIndexes,
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