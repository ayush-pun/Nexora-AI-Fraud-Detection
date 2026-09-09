import api from "../api";

export const getOverview = async () => {
  const response = await api.get("/admin/dashboard/overview");
  return response.data;
};

export const getDecisionBreakdown = async () => {
  const response = await api.get(
    "/admin/dashboard/decision-breakdown"
  );
  return response.data;
};

export const getFraudByHour = async () => {
  const response = await api.get(
    "/admin/dashboard/fraud-by-hour"
  );
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await api.get(
    "/admin/dashboard/recent-transactions"
  );
  return response.data;
};

export const getRiskDistribution = async () => {
  const response = await api.get(
    "/admin/dashboard/risk-distribution"
  );
  return response.data;
};

export const getFraudByAmount = async () => {
  const response = await api.get(
    "/admin/dashboard/fraud-by-amount"
  );
  return response.data;
};

export const getHighRiskUsers = async (limit = 10) => {
  const response = await api.get(
    "/admin/dashboard/high-risk-users",
    {
      params: { limit },
    }
  );
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get(
    "/admin/dashboard/model-metrics"
  );
  return response.data;
};

export const getShapGlobal = async () => {
  const response = await api.get(
    "/admin/dashboard/shap-global"
  );
  return response.data;
};