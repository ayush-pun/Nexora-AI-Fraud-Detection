import {
  ShieldCheck,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { useTransactions } from "../../services/transaction/transaction.query";

const AIStatusCard = () => {
  const { data, isLoading } = useTransactions();

  const transactions = Array.isArray(data)
    ? data
    : data?.data || data?.transactions || [];

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "COMPLETED"
  );

  const flaggedTransactions = transactions.filter(
    (transaction) =>
      transaction.fraudDecision &&
      !["APPROVE", "APPROVED"].includes(
        transaction.fraudDecision.toUpperCase()
      )
  );

  const approvedTransactions = transactions.filter(
    (transaction) =>
      transaction.fraudDecision &&
      ["APPROVE", "APPROVED"].includes(
        transaction.fraudDecision.toUpperCase()
      )
  );

  const totalEvaluated = approvedTransactions.length + flaggedTransactions.length;

  const protectionRate =
    totalEvaluated > 0
      ? Math.round((approvedTransactions.length / totalEvaluated) * 100)
      : 100;

  const threatLevel =
    flaggedTransactions.length === 0
      ? "LOW"
      : flaggedTransactions.length <= 2
        ? "MEDIUM"
        : "HIGH";

  const threatColor =
    threatLevel === "LOW"
      ? "text-emerald-600"
      : threatLevel === "MEDIUM"
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-indigo-200
        hover:shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-indigo-100
            transition-all
            duration-300
            group-hover:rotate-6
            group-hover:scale-110
          "
        >
          <ShieldCheck
            size={28}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            AI Fraud Detection
          </h2>

          <p className="text-sm text-slate-500">
            Real-time transaction monitoring
          </p>
        </div>
      </div>

      {/* System Status */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">
            System Status
          </span>

          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>

            <span className="font-semibold text-emerald-600">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* AI Models */}

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit
            size={18}
            className="text-indigo-600"
          />

          <h3 className="font-semibold text-slate-900">
            Active Models
          </h3>
        </div>

        <div className="space-y-3">
          {["XGBoost", "Isolation Forest"].map((model) => (
            <div
              key={model}
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:bg-white
                hover:shadow-md
              "
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  {model}
                </span>

                <CheckCircle2
                  size={18}
                  className="text-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Statistics */}

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Threat Level */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
            transition-all
            duration-300
            hover:scale-[1.03]
            hover:border-indigo-200
            hover:bg-white
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-2">
            {threatLevel === "LOW" ? (
              <ShieldCheck
                size={17}
                className="text-emerald-500"
              />
            ) : (
              <AlertTriangle
                size={17}
                className="text-amber-500"
              />
            )}

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Threat Level
            </p>
          </div>

          <h3
            className={`mt-2 text-2xl font-bold ${threatColor}`}
          >
            {isLoading ? "..." : threatLevel}
          </h3>
        </div>

        {/* Protection Rate */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
            transition-all
            duration-300
            hover:scale-[1.03]
            hover:border-indigo-200
            hover:bg-white
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-2">
            <Activity
              size={17}
              className="text-indigo-500"
            />

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Protection
            </p>
          </div>

          <h3 className="mt-2 text-2xl font-bold text-indigo-600">
            {isLoading ? "..." : `${protectionRate}%`}
          </h3>
        </div>
      </div>

      {/* Monitoring Summary */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-indigo-100
          bg-gradient-to-r
          from-indigo-50
          to-blue-50
          p-4
        "
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <ShieldCheck
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-slate-900">
              AI Protection Active
            </p>

            <p className="text-sm text-slate-600">
              {isLoading
                ? "Analyzing transactions..."
                : `${completedTransactions.length} completed transaction${
                    completedTransactions.length === 1 ? "" : "s"
                  } monitored`}
            </p>
          </div>
        </div>
      </div>

      {/* Flagged Transaction Notice */}

      {!isLoading && flaggedTransactions.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 text-amber-600"
            />

            <div>
              <p className="font-semibold text-amber-800">
                Suspicious Activity Detected
              </p>

              <p className="mt-1 text-sm text-amber-700">
                {flaggedTransactions.length} transaction
                {flaggedTransactions.length === 1 ? "" : "s"} require
                attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStatusCard;