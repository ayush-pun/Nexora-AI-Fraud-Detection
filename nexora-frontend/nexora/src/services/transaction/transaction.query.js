import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "./transaction.service";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};