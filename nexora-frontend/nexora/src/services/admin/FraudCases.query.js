import { useQuery } from "@tanstack/react-query";
import { getFraudCases } from "./fraudCases.service";

export const useFraudCases = (status) => {
  return useQuery({
    queryKey: ["admin-fraud-cases", status],
    queryFn: () => getFraudCases(status),
  });
};