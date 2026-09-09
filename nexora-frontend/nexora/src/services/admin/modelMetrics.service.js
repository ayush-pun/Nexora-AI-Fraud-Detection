import api from "../api";

export const getModelMetrics = async () => {
  const response = await api.get("/admin/dashboard/model-metrics");
  return response.data;
};