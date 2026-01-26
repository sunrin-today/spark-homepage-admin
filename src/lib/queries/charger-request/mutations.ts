import { useMutation, useQueryClient } from "@tanstack/react-query";
import chargerRequestApi from "@/lib/api/charger-request";
import { chargerRequestKeys } from "./keys";


export const useDeleteChargerRequest = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerRequestApi.deleteChargerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chargerRequestKeys.all() });
      alert("신청이 삭제되었습니다.");
    },
    onError: () => {
      alert("신청 삭제에 실패했습니다.");
    }
  });
};
