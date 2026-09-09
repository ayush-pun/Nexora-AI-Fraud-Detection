import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { useTransactions } from "../../services/transaction/transaction.query";

const WalletInsights = () => {
  const { data, isLoading } = useTransactions();

  const transactions = Array.isArray(data)
    ? data
    : data?.data || data?.transactions || [];

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "COMPLETED"
  );

  const moneySent = completedTransactions
    .filter(
      (transaction) =>
        transaction.type === "TRANSFER" ||
        transaction.type === "WITHDRAW"
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const moneyReceived = completedTransactions
    .filter((transaction) => transaction.type === "DEPOSIT")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const monthlySpend = moneySent;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Money Sent",
      value: isLoading ? "Loading..." : formatCurrency(moneySent),
      icon: ArrowUpRight,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Received",
      value: isLoading ? "Loading..." : formatCurrency(moneyReceived),
      icon: ArrowDownLeft,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Spend",
      value: isLoading ? "Loading..." : formatCurrency(monthlySpend),
      icon: Wallet,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },
  ];

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-xl
      "
    >
      {/* Header */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Wallet Insights
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your financial activity
        </p>
      </div>

      {/* Statistics */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:bg-white
                hover:shadow-md
              "
            >
              <div className="flex items-center justify-between">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    ${item.bg}
                    transition-all
                    duration-300
                    group-hover:scale-105
                  `}
                >
                  <Icon
                    size={18}
                    className={item.color}
                  />
                </div>
              </div>

              <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Activity Summary */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-indigo-100
          bg-gradient-to-r
          from-indigo-50
          to-blue-50
          p-4
          transition-all
          duration-300
          hover:shadow-md
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white
              shadow-sm
              transition-all
              duration-300
              group-hover:rotate-6
            "
          >
            <TrendingUp
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Transaction Activity
            </p>

            <h3 className="text-xl font-bold text-slate-900">
              {isLoading
                ? "Loading..."
                : `${completedTransactions.length} completed`}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInsights;