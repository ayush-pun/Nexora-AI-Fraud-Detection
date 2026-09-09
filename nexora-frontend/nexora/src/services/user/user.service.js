import api from "../api";

export const getCurrentUser = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/profile", data);
  return response.data;
};