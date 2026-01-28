import { useQuery } from "@tanstack/react-query";
import lostClaimApi from "@/lib/api/losts-claims";
import { lostClaimsKeys } from "./keys";

interface UseLostClaimsParams {
  lostId: string;
  page?: number;
  limit?: number;
  column?: string;
  orderDirection?: string;
}

export const useLostClaimsQuery = ({
  lostId,
  page = 1,
  limit = 10,
  column = "claimedAt",
  orderDirection = "DESC",
}: UseLostClaimsParams) => {
  return useQuery({
    queryKey: lostClaimsKeys.list({
      lostId,
      page,
      limit,
      column,
      orderDirection,
    }),
    queryFn: () =>
      lostClaimApi.getLostClaimsByLostId(
        lostId,
        page,
        limit,
        column,
        orderDirection
      ),
    enabled: !!lostId,
    placeholderData: (previousData) => previousData,
  });
};

export const useMyLostClaimsQuery = () => {
  return useQuery({
    queryKey: lostClaimsKeys.my(),
    queryFn: () => lostClaimApi.getMyLostClaims(),
    placeholderData: (previousData) => previousData,
  });
};
