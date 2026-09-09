import api from "../api";

// Dashboard overview
export const getDashboardOverview = async () => {
  const response = await api.get("/admin/dashboard/overview");
  return response.data;
};

// APPROVE / REVIEW / BLOCK
export const getDecisionBreakdown = async () => {
  const response = await api.get("/admin/dashboard/decision-breakdown");
  return response.data;
};

// Fraud activity by hour
export const getFraudByHour = async () => {
  const response = await api.get("/admin/dashboard/fraud-by-hour");
  return response.data;
};

// Transactions grouped by amount
export const getFraudByAmount = async () => {
  const response = await api.get("/admin/dashboard/fraud-by-amount");
  return response.data;
};

// Risk score distribution
export const getRiskDistribution = async () => {
  const response = await api.get("/admin/dashboard/risk-distribution");
  return response.data;
};

// Highest-risk users
export const getHighRiskUsers = async (limit = 10) => {
  const response = await api.get(
    `/admin/dashboard/high-risk-users?limit=${limit}`
  );

  return response.data;
};

// Recent transactions
export const getRecentTransactions = async (limit = 20) => {
  const response = await api.get(
    `/admin/dashboard/recent-transactions?limit=${limit}`
  );

  return response.data;
};

// ML model metrics
export const getModelMetrics = async () => {
  const response = await api.get("/admin/dashboard/model-metrics");
  return response.data;
};

// Global SHAP feature importance
export const getShapGlobal = async () => {
  const response = await api.get("/admin/dashboard/shap-global");
  return response.data;
};