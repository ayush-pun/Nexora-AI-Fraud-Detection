import { useState } from "react";
import {
    Wallet as WalletIcon,
    Search,
    RefreshCw,
    Snowflake,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

import {
    useAdminWallets,
    useUpdateWalletStatus,
} from "../../services/admin/wallet.query";


const Wallet = () => {

    // ========================================
    // STATE
    // ========================================

    const [search, setSearch] = useState("");

    const [selectedWallet, setSelectedWallet] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState(null);


    // ========================================
    // GET WALLETS
    // ========================================

    const {
        data: wallets,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAdminWallets();


    // ========================================
    // UPDATE STATUS
    // ========================================

    const updateStatusMutation = useUpdateWalletStatus();


    // ========================================
    // SEARCH
    // ========================================

    const filteredWallets = (wallets || []).filter((wallet) => {

        const searchValue = search.toLowerCase().trim();

        if (!searchValue) {
            return true;
        }

        return (
            wallet.walletNumber
                ?.toLowerCase()
                .includes(searchValue) ||

            wallet.username
                ?.toLowerCase()
                .includes(searchValue) ||

            wallet.userId
                ?.toLowerCase()
                .includes(searchValue) ||

            wallet.status
                ?.toLowerCase()
                .includes(searchValue)
        );
    });


    // ========================================
    // OPEN STATUS MODAL
    // ========================================

    const openStatusModal = (wallet, status) => {
        setSelectedWallet(wallet);
        setSelectedStatus(status);
    };


    // ========================================
    // CLOSE MODAL
    // ========================================

    const closeModal = () => {

        if (updateStatusMutation.isPending) {
            return;
        }

        setSelectedWallet(null);
        setSelectedStatus(null);
    };


    // ========================================
    // CONFIRM STATUS CHANGE
    // ========================================

    const handleStatusChange = async () => {

        if (!selectedWallet || !selectedStatus) {
            return;
        }

        try {

            await updateStatusMutation.mutateAsync({
                id: selectedWallet.id,
                status: selectedStatus,
            });

            closeModal();

        } catch (err) {

            console.error(
                "Failed to update wallet status:",
                err
            );
        }
    };


    // ========================================
    // FORMAT BALANCE
    // ========================================

    const formatBalance = (balance, currency = "NPR") => {

        return `${currency} ${Number(
            balance || 0
        ).toLocaleString()}`;
    };


    // ========================================
    // STATUS STYLES
    // ========================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "ACTIVE":
                return "bg-green-50 text-green-700 border-green-200";

            case "FROZEN":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "CLOSED":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (isLoading) {

        return (
            <div>

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Wallet Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage user wallets and control wallet status.
                    </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">

                    <div className="flex items-center justify-center">

                        <RefreshCw
                            size={22}
                            className="mr-3 animate-spin text-indigo-600"
                        />

                        <p className="text-slate-500">
                            Loading wallets...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================
    // ERROR
    // ========================================

    if (isError) {

        return (
            <div>

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Wallet Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage user wallets and control wallet status.
                    </p>

                </div>


                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                    <div className="flex items-start gap-3">

                        <AlertCircle
                            size={22}
                            className="mt-0.5 text-red-600"
                        />

                        <div>

                            <h2 className="font-bold text-red-800">
                                Unable to load wallets
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                Something went wrong while fetching
                                wallet data.
                            </p>

                            {error?.message && (
                                <p className="mt-2 text-xs text-red-500">
                                    {error.message}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================
    // MAIN UI
    // ========================================

    return (
        <div>

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">

                            <WalletIcon size={22} />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-slate-900">
                                Wallet Management
                            </h1>

                            <p className="mt-1 text-slate-500">
                                Manage user wallets and control wallet status.
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <RefreshCw
                        size={17}
                        className={
                            isFetching
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ========================================
                SUMMARY
            ======================================== */}

            <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Total Wallets
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {wallets?.length || 0}
                    </p>

                </div>


                {/* Active */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Active
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">

                        {
                            (wallets || []).filter(
                                (wallet) =>
                                    wallet.status === "ACTIVE"
                            ).length
                        }

                    </p>

                </div>


                {/* Frozen */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Frozen
                    </p>

                    <p className="mt-2 text-3xl font-bold text-amber-600">

                        {
                            (wallets || []).filter(
                                (wallet) =>
                                    wallet.status === "FROZEN"
                            ).length
                        }

                    </p>

                </div>


                {/* Closed */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Closed
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-600">

                        {
                            (wallets || []).filter(
                                (wallet) =>
                                    wallet.status === "CLOSED"
                            ).length
                        }

                    </p>

                </div>

            </div>


            {/* ========================================
                TABLE CARD
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Table Header */}

                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            All Wallets
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            View and manage all Nexora wallets.
                        </p>

                    </div>


                    {/* Search */}

                    <div className="relative w-full sm:w-80">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search wallet or user..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                </div>


                {/* Empty State */}

                {filteredWallets.length === 0 ? (

                    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                            <WalletIcon
                                size={25}
                                className="text-slate-400"
                            />

                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No wallets found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search.
                        </p>

                    </div>

                ) : (

                    /* ========================================
                       TABLE
                    ======================================== */

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">

                                    <th className="px-6 py-4 font-semibold">
                                        Wallet
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        User
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Balance
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right font-semibold">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredWallets.map(
                                    (wallet) => (

                                        <tr
                                            key={wallet.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                        >

                                            {/* Wallet */}

                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-slate-900">
                                                    {wallet.walletNumber}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {wallet.id}
                                                </p>

                                            </td>


                                            {/* User */}

                                            <td className="px-6 py-5">

                                                <p className="font-medium text-slate-900">
                                                    {wallet.username}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {wallet.userId}
                                                </p>

                                            </td>


                                            {/* Balance */}

                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-slate-900">

                                                    {formatBalance(
                                                        wallet.balance,
                                                        wallet.currency
                                                    )}

                                                </p>

                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                        wallet.status
                                                    )}`}
                                                >
                                                    {wallet.status}
                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-5">

                                                <div className="flex justify-end gap-2">

                                                    {/* ACTIVE */}

                                                    {wallet.status !== "ACTIVE" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openStatusModal(
                                                                    wallet,
                                                                    "ACTIVE"
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                                                        >

                                                            <CheckCircle size={15} />

                                                            Activate

                                                        </button>

                                                    )}


                                                    {/* FREEZE */}

                                                    {wallet.status !== "FROZEN" &&
                                                        wallet.status !== "CLOSED" && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        wallet,
                                                                        "FROZEN"
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                                            >

                                                                <Snowflake size={15} />

                                                                Freeze

                                                            </button>

                                                        )}


                                                    {/* CLOSE */}

                                                    {wallet.status !== "CLOSED" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openStatusModal(
                                                                    wallet,
                                                                    "CLOSED"
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                                        >

                                                            <XCircle size={15} />

                                                            Close

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ========================================
                STATUS CONFIRMATION MODAL
            ======================================== */}

            {selectedWallet && selectedStatus && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start gap-4">

                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                    selectedStatus === "FROZEN"
                                        ? "bg-amber-100"
                                        : selectedStatus === "CLOSED"
                                            ? "bg-red-100"
                                            : "bg-green-100"
                                }`}
                            >

                                {selectedStatus === "FROZEN" ? (

                                    <Snowflake
                                        size={21}
                                        className="text-amber-600"
                                    />

                                ) : selectedStatus === "CLOSED" ? (

                                    <XCircle
                                        size={21}
                                        className="text-red-600"
                                    />

                                ) : (

                                    <CheckCircle
                                        size={21}
                                        className="text-green-600"
                                    />

                                )}

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Change wallet status?
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    You are about to change this wallet's
                                    status.
                                </p>

                            </div>

                        </div>


                        {/* Wallet information */}

                        <div className="mt-5 rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Wallet
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {selectedWallet.walletNumber}
                                </span>

                            </div>


                            <div className="mt-3 flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    User
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {selectedWallet.username}
                                </span>

                            </div>


                            <div className="mt-3 flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Current status
                                </span>

                                <span
                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                                        selectedWallet.status
                                    )}`}
                                >
                                    {selectedWallet.status}
                                </span>

                            </div>


                            <div className="mt-3 flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    New status
                                </span>

                                <span
                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                                        selectedStatus
                                    )}`}
                                >
                                    {selectedStatus}
                                </span>

                            </div>

                        </div>


                        {/* Warning */}

                        {selectedStatus === "FROZEN" && (

                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

                                <p className="text-sm text-amber-800">
                                    A frozen wallet will reject all future
                                    transactions. Existing transactions are
                                    not reversed.
                                </p>

                            </div>

                        )}


                        {selectedStatus === "CLOSED" && (

                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="text-sm text-red-800">
                                    Closing a wallet prevents further wallet
                                    activity. Make sure you want to perform
                                    this action.
                                </p>

                            </div>

                        )}


                        {/* Buttons */}

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={
                                    updateStatusMutation.isPending
                                }
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={handleStatusChange}
                                disabled={
                                    updateStatusMutation.isPending
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    selectedStatus === "FROZEN"
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : selectedStatus === "CLOSED"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                }`}
                            >

                                {updateStatusMutation.isPending
                                    ? "Updating..."
                                    : `Set ${selectedStatus}`}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default Wallet;