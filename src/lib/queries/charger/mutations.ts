import { useMutation, useQueryClient } from "@tanstack/react-query";
import chargerAPI from "@/lib/api/charger";
import { chargerKeys } from "./keys";
import chargerApi from "@/lib/api/charger";

export const useReturnCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerAPI.changeChargerStatus(id, "not_rented"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
      alert("충전기 상태가 미대여로 변경되었습니다.");
    },
    onError: () => {
      alert("충전기 상태 변경에 실패했습니다.");
    }
  });
};


export const useRentCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerAPI.changeChargerStatus(id, "renting"),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: chargerKeys.all() });
      queryClient.invalidateQueries({ queryKey: chargerKeys.detail(id) });
      alert("충전기 상태가 대여중으로 변경되었습니다.");
    },
    onError: () => {
      alert("충전기 상태 변경에 실패했습니다.");
    }
  });
};

export const useWaitingCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, rentalRequestId, chargerId }: {id: string, rentalRequestId: string, chargerId: string}) => chargerAPI.changeChargerStatus(id, "waiting", rentalRequestId),
    onSuccess: (_, {id, chargerId, rentalRequestId} : {id: string, chargerId: string, rentalRequestId: string}) => {
      queryClient.invalidateQueries({ queryKey: chargerKeys.all() });
      queryClient.invalidateQueries({ queryKey: chargerKeys.detail(chargerId) });
      alert("충전기 상태가 전달예정으로 변경되었습니다.");
    },
    onError: () => {
      alert("충전기 상태 변경에 실패했습니다.");
    }
  });
};

export const useDeleteCharger = () => {

  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (id: string) => chargerApi.deleteCharger(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: chargerKeys.all() });
        alert("충전기가 삭제되었습니다.");
      },
      onError: () => {
        alert("충전기 삭제에 실패했습니다.");
      }
    }
  )
}