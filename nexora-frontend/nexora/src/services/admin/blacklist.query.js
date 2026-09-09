import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getBlacklist,
  addBlacklistEntry,
  removeBlacklistEntry,
} from "./blacklist.service";


// ================================
// GET BLACKLIST
// ================================

export const useBlacklist = () => {
  return useQuery({
    queryKey: ["admin", "blacklist"],
    queryFn: getBlacklist,
  });
};


// ================================
// ADD BLACKLIST ENTRY
// ================================

export const useAddBlacklistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBlacklistEntry,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "blacklist"],
      });
    },
  });
};


// ================================
// REMOVE BLACKLIST ENTRY
// ================================

export const useRemoveBlacklistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBlacklistEntry,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "blacklist"],
      });
    },
  });
};