import { useQuery } from "@tanstack/react-query";
import { getWallet } from "./wallet.service";

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });
};