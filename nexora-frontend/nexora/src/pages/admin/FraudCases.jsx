import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  ShieldAlert,
} from "lucide-react";

import { useFraudCases } from "../../services/admin/fraudCases.query";

const STATUS_OPTIONS = [
  "ALL",
  "OPEN",
  "IN_REVIEW",
  "ESCALATED",
  "RESOLVED_FRAUD",
  "RESOLVED_LEGIT",
];

const getStatusStyle = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-red-50 text-red-700 border-red-200";

    case "IN_REVIEW":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ESCALATED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "RESOLVED_FRAUD":
      return "bg-red-50 text-red-700 border-red-200";

    case "RESOLVED_LEGIT":
      return "bg-green-50 text-green-700 border-green-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-50 text-red-700";

    case "MEDIUM":
      return "bg-amber-50 text-amber-700";

    case "LOW":
      return "bg-green-50 text-green-700";

    default:
      return "bg-slate-50 text-slate-600";
  }
};

const formatStatus = (status) => {
  if (!status) return "—";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString();
};

const FraudCases = () => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const {
    data: fraudCases,
    isLoading,
    isError,
  } = useFraudCases(
    selectedStatus === "ALL" ? undefined : selectedStatus
  );

  const cases = Array.isArray(fraudCases) ? fraudCases : [];

  return (
    <div>
      {/* =========================
          HEADER
      ========================== */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ShieldAlert size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Fraud Cases
              </h1>

              <p className="mt-1 text-slate-500">
                Monitor and review suspicious transactions detected by Nexora.
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "ALL"
                  ? "All Cases"
                  : formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================
          SUMMARY
      ========================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Cases
            </p>

            <AlertTriangle
              size={20}
              className="text-red-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {cases.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Open
            </p>

            <Clock
              size={20}
              className="text-amber-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-600">
            {
              cases.filter(
                (item) => item.status === "OPEN"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Escalated
            </p>

            <AlertTriangle
              size={20}
              className="text-purple-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-purple-600">
            {
              cases.filter(
                (item) => item.status === "ESCALATED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <CheckCircle
              size={20}
              className="text-green-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-green-600">
            {
              cases.filter(
                (item) =>
                  item.status === "RESOLVED_FRAUD" ||
                  item.status === "RESOLVED_LEGIT"
              ).length
            }
          </p>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================== */}

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <p className="text-slate-500">
            Loading fraud cases...
          </p>
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={22}
              className="text-red-600"
            />

            <div>
              <h2 className="font-bold text-red-800">
                Unable to load fraud cases
              </h2>

              <p className="mt-1 text-sm text-red-600">
                Something went wrong while fetching fraud case data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          TABLE
      ========================== */}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">
                    Transaction
                  </th>

                  <th className="px-6 py-4 font-medium">
                    User
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Type
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Amount
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Risk
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Priority
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Created
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {cases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <CheckCircle
                          size={40}
                          className="text-green-500"
                        />

                        <p className="mt-3 font-semibold text-slate-700">
                          No fraud cases found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          There are no cases matching this filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cases.map((fraudCase) => {
                    const transaction =
                      fraudCase.transaction;

                    const user =
                      transaction?.wallet?.user;

                    return (
                      <tr
                        key={fraudCase.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        {/* Transaction */}

                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">
                            {transaction?.transactionReference ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {transaction?.id || "—"}
                          </p>
                        </td>

                        {/* User */}

                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {user
                              ? `${user.firstName || ""} ${
                                  user.lastName || ""
                                }`.trim()
                              : "Unknown User"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user?.email || "—"}
                          </p>
                        </td>

                        {/* Type */}

                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {transaction?.type || "—"}
                        </td>

                        {/* Amount */}

                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">
                            {transaction?.currency || "NPR"}{" "}
                            {Number(
                              transaction?.amount || 0
                            ).toLocaleString()}
                          </p>
                        </td>

                        {/* Risk */}

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              fraudCase.riskScore >= 80
                                ? "bg-red-50 text-red-700"
                                : fraudCase.riskScore >= 50
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {fraudCase.riskScore ?? 0}
                          </span>
                        </td>

                        {/* Priority */}

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                              fraudCase.priority
                            )}`}
                          >
                            {fraudCase.priority || "—"}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              fraudCase.status
                            )}`}
                          >
                            {formatStatus(
                              fraudCase.status
                            )}
                          </span>
                        </td>

                        {/* Created */}

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            fraudCase.createdAt
                          )}
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudCases;