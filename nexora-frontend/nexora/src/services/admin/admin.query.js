import { useQuery } from "@tanstack/react-query";

import {
  getOverview,
  getDecisionBreakdown,
  getFraudByHour,
  getRecentTransactions,
} from "./dashboard.services";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: getOverview,
  });
};

export const useDecisionBreakdown = () => {
  return useQuery({
    queryKey: ["admin-decision-breakdown"],
    queryFn: getDecisionBreakdown,
  });
};

export const useFraudByHour = () => {
  return useQuery({
    queryKey: ["admin-fraud-by-hour"],
    queryFn: getFraudByHour,
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ["admin-recent-transactions"],
    queryFn: getRecentTransactions,
  });
};