import { useQuery } from "@tanstack/react-query";

import {
  getOverview,
  getDecisionBreakdown,
  getFraudByHour,
  getRecentTransactions,
  getRiskDistribution,
  getFraudByAmount,
  getHighRiskUsers,
  getModelMetrics,
  getShapGlobal,
} from "./dashboard.services";

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

export const useRiskDistribution = () => {
  return useQuery({
    queryKey: ["risk-distribution"],
    queryFn: getRiskDistribution,
  });
};

export const useFraudByAmount = () => {
  return useQuery({
    queryKey: ["fraud-by-amount"],
    queryFn: getFraudByAmount,
  });
};

export const useHighRiskUsers = () => {
  return useQuery({
    queryKey: ["high-risk-users"],
    queryFn: () => getHighRiskUsers(10),
  });
};

export const useModelMetrics = () => {
  return useQuery({
    queryKey: ["model-metrics"],
    queryFn: getModelMetrics,
  });
};

export const useShapGlobal = () => {
  return useQuery({
    queryKey: ["shap-global"],
    queryFn: getShapGlobal,
  });
};