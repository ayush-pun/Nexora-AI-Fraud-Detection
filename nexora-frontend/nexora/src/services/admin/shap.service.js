import api from "../api";

export const getGlobalShap = async () => {
  const response = await api.get("/admin/dashboard/shap-global");
  return response.data;
};