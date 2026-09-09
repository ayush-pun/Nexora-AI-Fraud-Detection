import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./user.service";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
};