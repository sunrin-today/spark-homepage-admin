import { LostFormState  } from "@/lib/types/losts";
import { FormImageListItem, ImageItem } from "@/lib/types/common";

export function buildLostCreatePayload(form: LostFormState) {
  return {
    title: form.title,
    description: form.description,
    location: form.location,
    foundDate: form.foundDate,
    thumbnail: form.thumbnail!, // create에서는 필수

    detailImages: form.detailImages
      .filter((i): i is Extract<FormImageListItem, { type: "new" }> => i && i.type === "new")
      .map((i) => i.file),
  };
}
export function buildLostUpdatePayload(form: LostFormState, initialDetailImages: ImageItem[]) {
    
    const exists = form.detailImages.map((item, index) =>
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
    ).map((item) => item.url);

    return {
    title: form.title,
    description: form.description,
    location: form.location,
    foundDate: form.foundDate,
    thumbnail: form.thumbnail!, // update에서는 필수
    exists: exists,
    deletes: deletes,
    newImages: newImages,
    imageIndexs: imageIndexes,
  };
}