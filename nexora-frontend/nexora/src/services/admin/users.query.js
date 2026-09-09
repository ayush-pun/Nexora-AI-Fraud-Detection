import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  updateUserStatus,
} from "./users.service";

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateUserStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
};