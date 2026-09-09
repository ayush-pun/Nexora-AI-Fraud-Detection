import api from "../api";

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.patch(
    `/admin/users/${id}/status`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return response.data;
};