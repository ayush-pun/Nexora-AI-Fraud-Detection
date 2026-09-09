import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveFraudCase } from "./fraudCases.service";

export const useResolveFraudCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolution, notes, reverseTransaction }) =>
      resolveFraudCase(id, { resolution, notes, reverseTransaction }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-fraud-cases"],
      });
    },
  });
};
