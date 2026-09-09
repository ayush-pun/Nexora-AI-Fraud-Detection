import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deposit,
  withdraw,
  transfer,
} from "./transaction.service";

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deposit,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
    },
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transfer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
    },
  });
};