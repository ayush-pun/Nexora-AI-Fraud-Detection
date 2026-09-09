import { useQuery } from "@tanstack/react-query";

import {
  getOverview,
  getDecisionBreakdown,
  getFraudByHour,
  getRecentTransactions,
} from "./dashboard.service";

export const useOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: getOverview,
  });
};

export const useDecisionBreakdown = () => {
  return useQuery({
    queryKey: ["decision-breakdown"],
    queryFn: getDecisionBreakdown,
  });
};

export const useFraudByHour = () => {
  return useQuery({
    queryKey: ["fraud-hour"],
    queryFn: getFraudByHour,
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ["recent-transactions"],
    queryFn: getRecentTransactions,
  });
};