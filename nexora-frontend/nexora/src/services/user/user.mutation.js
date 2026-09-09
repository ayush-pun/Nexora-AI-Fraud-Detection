import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "./user.service";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      queryClient.setQueryData(["current-user"], data);

      // Keep localStorage user information synchronized too
      const existingUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          ...data,
        })
      );
    },
  });
};