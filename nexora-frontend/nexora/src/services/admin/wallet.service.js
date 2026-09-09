import api from "../api";


// ================================
// GET ALL ADMIN WALLETS
// ================================

export const getAdminWallets = async () => {
    const response = await api.get("/admin/wallets");

    return response.data;
};


// ================================
// UPDATE WALLET STATUS
// ================================

export const updateWalletStatus = async ({ id, status }) => {
    const response = await api.patch(
        `/admin/wallets/${id}/status`,
        null,
        {
            params: {
                status,
            },
        }
    );

    return response.data;
};