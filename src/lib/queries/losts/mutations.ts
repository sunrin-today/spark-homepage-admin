// lib/queries/losts/mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lostApi from "@/lib/api/losts";
import { lostKeys } from "./keys";
import { LostFormState } from "@/lib/types/losts";
import { buildLostCreatePayload, buildLostUpdatePayload } from "@/utils/losts";
import { ImageItem } from "@/lib/types/common";
import { useRouter } from "next/navigation";

/* 생성 */
export function useCreateLostMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (form: LostFormState) =>{
      console.log(buildLostCreatePayload(form));
      return lostApi.createLost(buildLostCreatePayload(form));
    },

    onSuccess: () => {
      alert("분실물이 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: lostKeys.lists() });
      router.push("/losts");
    },
  });
}

/* 수정 */
export function useUpdateLostMutation(
  id: string,
  initialDetailImages: ImageItem[]
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (form: LostFormState) => {
      console.log(buildLostUpdatePayload(form, initialDetailImages));
      return lostApi.updateLost(
        id,
        buildLostUpdatePayload(form, initialDetailImages)
      );
    },

    onSuccess: () => {
      alert("분실물이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: lostKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lostKeys.lists() });
      router.push("/losts");
    },
  });
}

/* 삭제 */
export function useDeleteLostMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => lostApi.deleteLost(id),

    onSuccess: () => {
      alert("분실물이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: lostKeys.lists() });
      router.push("/losts");
    },
  });
}
