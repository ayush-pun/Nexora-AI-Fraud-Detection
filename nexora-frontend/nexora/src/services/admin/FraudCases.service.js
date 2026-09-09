import api from "../api";

export const getFraudCases = async (status) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  const response = await api.get("/admin/fraud-cases", {
    params,
  });

  return response.data;
};