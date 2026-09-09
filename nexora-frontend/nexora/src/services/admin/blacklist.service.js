import api from "../api";


// ================================
// GET ACTIVE BLACKLIST
// ================================

export const getBlacklist = async () => {
  const response = await api.get("/admin/blacklist");

  return response.data;
};


// ================================
// ADD TO BLACKLIST
// ================================

export const addBlacklistEntry = async (data) => {
  const response = await api.post("/admin/blacklist", data);

  return response.data;
};


// ================================
// REMOVE FROM BLACKLIST
// ================================

export const removeBlacklistEntry = async (id) => {
  const response = await api.delete(`/admin/blacklist/${id}`);

  return response.data;
};