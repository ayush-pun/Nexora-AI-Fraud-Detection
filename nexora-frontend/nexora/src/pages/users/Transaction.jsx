import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useTransactions } from "../../services/transaction/transaction.query";

const Transactions = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useTransactions();

  /*
   * Depending on your backend response, transactions may be:
   *
   * data.transactions
   * OR
   * data
   *
   * This handles both.
   */
  const transactions = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.transactions)) {
      return data.transactions;
    }

    return [];
  }, [data]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const type = transaction.type?.toUpperCase() || "";
      const description =
        transaction.description?.toLowerCase() || "";
      const reference =
        transaction.transactionReference?.toLowerCase() || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        description.includes(searchText) ||
        reference.includes(searchText) ||
        type.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "ALL" || type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getTransactionIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOSIT":
        return (
          <ArrowDownLeft
            size={21}
            className="text-emerald-600"
          />
        );

      case "TRANSFER":
        return (
          <ArrowUpRight
            size={21}
            className="text-indigo-600"
          />
        );

      case "WITHDRAW":
      case "WITHDRAWAL":
        return (
          <ArrowUpRight
            size={21}
            className="text-red-600"
          />
        );

      default:
        return (
          <Wallet
            size={21}
            className="text-slate-600"
          />
        );
    }
  };

  const getIconBackground = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOSIT":
        return "bg-emerald-100";

      case "TRANSFER":
        return "bg-indigo-100";

      case "WITHDRAW":
      case "WITHDRAWAL":
        return "bg-red-100";

      default:
        return "bg-slate-100";
    }
  };

  const getAmountStyle = (type) => {
    return type?.toUpperCase() === "DEPOSIT"
      ? "text-emerald-600"
      : "text-red-600";
  };

  const getAmountPrefix = (type) => {
    return type?.toUpperCase() === "DEPOSIT"
      ? "+"
      : "-";
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <CheckCircle2
            size={14}
            className="text-emerald-600"
          />
        );

      case "PENDING":
        return (
          <Clock3
            size={14}
            className="text-amber-600"
          />
        );

      case "FAILED":
      case "REJECTED":
        return (
          <XCircle
            size={14}
            className="text-red-600"
          />
        );

      default:
        return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";

      case "PENDING":
        return "bg-amber-100 text-amber-700";

      case "FAILED":
      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Transactions
            </h1>

            <p className="mt-1 text-slate-500">
              View your complete wallet activity.
            </p>
          </div>

        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Transactions
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-600">
              {
                transactions.filter(
                  (transaction) =>
                    transaction.status?.toUpperCase() ===
                    "COMPLETED"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Showing
            </p>

            <h2 className="mt-2 text-2xl font-bold text-indigo-600">
              {filteredTransactions.length}
            </h2>
          </div>

        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Filters */}
          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-md">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">

                <Filter
                  size={18}
                  className="text-slate-500"
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="ALL">
                    All Transactions
                  </option>

                  <option value="DEPOSIT">
                    Deposits
                  </option>

                  <option value="TRANSFER">
                    Transfers
                  </option>

                  <option value="WITHDRAW">
                    Withdrawals
                  </option>
                </select>

              </div>

            </div>

          </div>

          {/* Content */}
          <div className="p-5">

            {/* Loading */}
            {isLoading && (
              <div className="py-16 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading transactions...
                </p>

              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                <XCircle
                  size={30}
                  className="mx-auto text-red-500"
                />

                <h3 className="mt-3 font-semibold text-red-800">
                  Unable to load transactions
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  {error?.response?.data?.message ||
                    "Something went wrong while loading your transactions."}
                </p>

              </div>
            )}

            {/* Empty */}
            {!isLoading &&
              !isError &&
              filteredTransactions.length === 0 && (
                <div className="py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Wallet
                      size={28}
                      className="text-slate-400"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No transactions found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your wallet activity will appear here.
                  </p>

                </div>
              )}

            {/* Transactions */}
            {!isLoading &&
              !isError &&
              filteredTransactions.length > 0 && (
                <div className="space-y-3">

                  {filteredTransactions.map(
                    (transaction) => {

                      const type =
                        transaction.type?.toUpperCase();

                      return (
                        <div
                          key={transaction.id}
                          className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
                        >

                          {/* Left */}
                          <div className="flex items-center gap-4">

                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${getIconBackground(
                                type
                              )}`}
                            >
                              {getTransactionIcon(type)}
                            </div>

                            <div className="min-w-0">

                              <h3 className="font-semibold text-slate-900">
                                {transaction.description ||
                                  type ||
                                  "Transaction"}
                              </h3>

                              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                {type || "UNKNOWN"}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                {transaction.transactionReference ||
                                  "No reference"}
                              </p>

                            </div>

                          </div>

                          {/* Right */}
                          <div className="text-left md:text-right">

                            <p
                              className={`text-lg font-bold ${getAmountStyle(
                                type
                              )}`}
                            >
                              {getAmountPrefix(type)}
                              {formatCurrency(
                                transaction.amount
                              )}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 md:justify-end">

                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                  transaction.status
                                )}`}
                              >
                                {getStatusIcon(
                                  transaction.status
                                )}

                                {transaction.status ||
                                  "UNKNOWN"}
                              </span>

                              <span className="text-xs text-slate-400">
                                {formatDate(
                                  transaction.createdAt
                                )}
                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Transactions;

