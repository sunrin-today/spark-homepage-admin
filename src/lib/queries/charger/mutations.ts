import { useMutation, useQueryClient } from "@tanstack/react-query";
import chargerAPI from "@/lib/api/charger";

export const useReturnCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerAPI.changeChargerStatus(id, "not_rented"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
      alert("충전기 상태가 미대여로 변경되었습니다.");
    },
  });
};


export const useRentCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerAPI.changeChargerStatus(id, "renting"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
      alert("충전기 상태가 대여중으로 변경되었습니다.");
    },
  });
};

export const useTransferCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargerAPI.changeChargerStatus(id, "waiting"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
      alert("충전기 상태가 전달예정으로 변경되었습니다.");
    },
  });
};
