import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getAdminWallets,
    updateWalletStatus,
} from "./wallet.service";


// ========================================
// GET ADMIN WALLETS
// ========================================

export const useAdminWallets = () => {
    return useQuery({
        queryKey: ["admin-wallets"],
        queryFn: getAdminWallets,
    });
};


// ========================================
// UPDATE WALLET STATUS
// ========================================

export const useUpdateWalletStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateWalletStatus,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-wallets"],
            });
        },
    });
};