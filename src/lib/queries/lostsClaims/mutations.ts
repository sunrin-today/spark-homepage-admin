import { useMutation, useQueryClient } from "@tanstack/react-query";
import lostClaimApi from "@/lib/api/losts-claims";
import { lostClaimsKeys } from "./keys";
import { lostKeys } from "../losts/keys";

export const useChangeLostClaimStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectReason, 
    }: {
      id: string;
      status: string;
      rejectReason?: string;
    }) =>
      lostClaimApi.changeLostClaimStatus(id, status, rejectReason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lostClaimsKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: lostKeys.all,
      });
    },
  });
};

export const useDeleteLostClaimMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lostClaimApi.deleteLostClaim(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lostClaimsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: lostKeys.all,
      });
    },
  });
};
