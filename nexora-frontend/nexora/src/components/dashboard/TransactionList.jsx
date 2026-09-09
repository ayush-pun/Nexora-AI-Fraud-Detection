import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
} from "lucide-react";

import { useTransactions } from "../../services/transaction/transaction.query";

const TransactionList = () => {
  const {
    data,
    isLoading,
    isError,
  } = useTransactions();

  const transactions = Array.isArray(data)
    ? data
    : data?.transactions || [];

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getType = (transaction) => {
    return transaction.type?.toUpperCase() || "";
  };

  const isIncoming = (transaction) => {
    return getType(transaction) === "DEPOSIT";
  };

  const getIcon = (transaction) => {
    const type = getType(transaction);

    if (type === "DEPOSIT") {
      return (
        <ArrowDownLeft
          size={22}
          className="text-emerald-600"
        />
      );
    }

    if (
      type === "TRANSFER" ||
      type === "WITHDRAW" ||
      type === "WITHDRAWAL"
    ) {
      return (
        <ArrowUpRight
          size={22}
          className="text-red-600"
        />
      );
    }

    return (
      <Wallet
        size={22}
        className="text-slate-600"
      />
    );
  };

  const getIconBackground = (transaction) => {
    return isIncoming(transaction)
      ? "bg-emerald-100"
      : "bg-red-100";
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest wallet activity
          </p>
        </div>

        <button
          onClick={() =>
            (window.location.href = "/transactions")
          }
          className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
        >
          View All →
        </button>

      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading transactions...
          </p>

        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-semibold text-red-700">
            Unable to load transactions.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please try again later.
          </p>

        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        recentTransactions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Wallet
                size={25}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No transactions yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your wallet activity will appear here.
            </p>

          </div>
        )}

      {/* Transaction List */}
      {!isLoading &&
        !isError &&
        recentTransactions.length > 0 && (
          <div className="max-h-[620px] space-y-4 overflow-y-auto pr-2">

            {recentTransactions.map((transaction) => {

              const incoming =
                isIncoming(transaction);

              const type =
                getType(transaction);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                >

                  {/* Left */}
                  <div className="flex min-w-0 items-center gap-4">

                    <div
                      className={`rounded-2xl p-3 ${getIconBackground(
                        transaction
                      )}`}
                    >
                      {getIcon(transaction)}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-slate-900">
                        {transaction.description ||
                          type ||
                          "Transaction"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {type}
                      </p>

                    </div>

                  </div>

                  {/* Right */}
                  <div className="ml-4 shrink-0 text-right">

                    <p
                      className={`text-lg font-bold ${
                        incoming
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {incoming ? "+" : "-"}
                      {formatCurrency(
                        transaction.amount
                      )}
                    </p>

                    <div className="mt-1 flex items-center justify-end gap-2">

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        ✓{" "}
                        {transaction.status ||
                          "COMPLETED"}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatTime(
                          transaction.createdAt
                        )}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
};

export default TransactionList;

