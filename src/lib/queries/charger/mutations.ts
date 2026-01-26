import { useMutation, useQueryClient } from "@tanstack/react-query";
import chargerAPI from "@/lib/api/charger";

export const useReturnCharger = () => {
    
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chargerId: string) => chargerAPI.updateChargerStatus(chargerId, "not_rented"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
    },
  });
};
