import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  useOverview,
  useDecisionBreakdown,
  useFraudByHour,
  useRecentTransactions,
  useRiskDistribution,
  useFraudByAmount,
  useHighRiskUsers,
} from "../../services/admin/dashboard.query";

const AdminDashboard = () => {
  // =========================
  // OVERVIEW
  // =========================

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useOverview();

  // =========================
  // DECISION BREAKDOWN
  // =========================

  const {
    data: decisionData,
    isLoading: decisionLoading,
    isError: decisionError,
  } = useDecisionBreakdown();

  // =========================
  // FRAUD BY HOUR
  // =========================

  const {
    data: fraudByHourData,
    isLoading: fraudByHourLoading,
    isError: fraudByHourError,
  } = useFraudByHour();

  // =========================
  // RECENT TRANSACTIONS
  // =========================

  const {
    data: recentTransactions,
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useRecentTransactions();

  // =========================
  // RISK DISTRIBUTION
  // =========================

  const {
    data: riskDistribution,
    isLoading: riskLoading,
    isError: riskError,
  } = useRiskDistribution();

  // =========================
  // FRAUD BY AMOUNT
  // =========================

  const {
    data: fraudByAmount,
    isLoading: fraudAmountLoading,
    isError: fraudAmountError,
  } = useFraudByAmount();

  // =========================
  // HIGH-RISK USERS
  // =========================

  const {
    data: highRiskUsers,
    isLoading: highRiskLoading,
    isError: highRiskError,
  } = useHighRiskUsers();

  // =========================
  // LOADING
  // =========================

  if (overviewLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (overviewError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-800">
          Unable to load admin dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Something went wrong while fetching dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor Nexora transactions, fraud activity, and system health.
        </p>
      </div>


      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Users */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {overview?.totalUsers ?? 0}
          </p>
        </div>


        {/* Total Transactions */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {overview?.totalTransactions ?? 0}
          </p>
        </div>


        {/* Total Volume */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Volume
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            NPR{" "}
            {Number(
              overview?.totalVolume ?? 0
            ).toLocaleString()}
          </p>
        </div>


        {/* Flagged Transactions */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Flagged Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {overview?.flaggedTransactions ?? 0}
          </p>
        </div>


        {/* Blocked Transactions */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Blocked Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {overview?.blockedTransactions ?? 0}
          </p>
        </div>


        {/* Open Fraud Cases */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Fraud Cases
          </p>

          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {overview?.openCases ?? 0}
          </p>
        </div>

      </div>


      {/* =====================================================
          TRANSACTION DECISIONS + RECENT TRANSACTIONS
      ====================================================== */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* ===================================================
            TRANSACTION DECISIONS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Transaction Decisions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Breakdown of approved, reviewed, and blocked transactions.
            </p>
          </div>


          {decisionLoading ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-slate-400">
                Loading chart...
              </p>
            </div>

          ) : decisionError ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-red-500">
                Unable to load decision data.
              </p>
            </div>

          ) : !decisionData ||
            decisionData.length === 0 ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-slate-400">
                No decision data available.
              </p>
            </div>

          ) : (

            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={decisionData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {decisionData.map(
                      (entry, index) => {

                        let fill = "#6366f1";

                        if (entry.label === "APPROVE") {
                          fill = "#22c55e";
                        }

                        if (entry.label === "REVIEW") {
                          fill = "#f59e0b";
                        }

                        if (entry.label === "BLOCK") {
                          fill = "#ef4444";
                        }

                        return (
                          <Cell
                            key={`decision-${index}`}
                            fill={fill}
                          />
                        );
                      }
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* ===================================================
            RECENT TRANSACTIONS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest transactions processed by the Nexora system.
            </p>
          </div>


          {transactionsLoading ? (

            <div className="flex h-40 items-center justify-center">
              <p className="text-slate-400">
                Loading transactions...
              </p>
            </div>

          ) : transactionsError ? (

            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-red-500">
                Unable to load recent transactions.
              </p>
            </div>

          ) : !recentTransactions ||
            recentTransactions.length === 0 ? (

            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-slate-400">
                No recent transactions found.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-slate-200 text-sm text-slate-500">

                    <th className="px-4 py-3 font-medium">
                      Transaction
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Type
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Amount
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Decision
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentTransactions.map(
                    (transaction, index) => {

                      const [
                        id,
                        reference,
                        type,
                        amount,
                        status,
                        decision,
                        timestamp,
                      ] = transaction;

                      return (

                        <tr
                          key={id || index}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >

                          {/* Transaction */}

                          <td className="px-4 py-4">

                            <p className="font-medium text-slate-900">
                              {reference}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {id}
                            </p>

                          </td>


                          {/* Type */}

                          <td className="px-4 py-4">

                            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {type}
                            </span>

                          </td>


                          {/* Amount */}

                          <td className="px-4 py-4 font-semibold text-slate-900">

                            NPR{" "}
                            {Number(
                              amount ?? 0
                            ).toLocaleString()}

                          </td>


                          {/* Status */}

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                status === "COMPLETED"
                                  ? "bg-green-50 text-green-700"
                                  : status === "PENDING"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                              }`}
                            >
                              {status}
                            </span>

                          </td>


                          {/* Decision */}

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                decision === "APPROVE"
                                  ? "bg-green-50 text-green-700"
                                  : decision === "REVIEW"
                                    ? "bg-amber-50 text-amber-700"
                                    : decision === "BLOCK"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {decision}
                            </span>

                          </td>


                          {/* Date */}

                          <td className="px-4 py-4 text-sm text-slate-500">

                            {timestamp
                              ? new Date(
                                  timestamp
                                ).toLocaleString()
                              : "—"}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          FRAUD BY HOUR
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900">
            Fraud Activity by Hour
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Transaction activity and fraud patterns throughout the day.
          </p>

        </div>


        {fraudByHourLoading ? (

          <div className="flex h-72 items-center justify-center">
            <p className="text-slate-400">
              Loading fraud activity...
            </p>
          </div>

        ) : fraudByHourError ? (

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-red-500">
              Unable to load fraud activity.
            </p>
          </div>

        ) : !fraudByHourData ||
          fraudByHourData.length === 0 ? (

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-slate-400">
              No fraud activity data available.
            </p>
          </div>

        ) : (

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={fraudByHourData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Transactions"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="fraud"
                  name="Fraud"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* =====================================================
          RISK DISTRIBUTION + FRAUD BY AMOUNT
      ====================================================== */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* ===================================================
            RISK DISTRIBUTION
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              Risk Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of transactions across risk score ranges.
            </p>

          </div>


          {riskLoading ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-slate-400">
                Loading risk distribution...
              </p>
            </div>

          ) : riskError ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-red-500">
                Unable to load risk distribution.
              </p>
            </div>

          ) : !riskDistribution ||
            riskDistribution.length === 0 ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-slate-400">
                No risk data available.
              </p>
            </div>

          ) : (

            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={riskDistribution}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {riskDistribution.map(
                      (entry, index) => (

                        <Cell
                          key={`risk-${index}`}
                          fill={
                            index === 0
                              ? "#22c55e"
                              : index === 1
                                ? "#84cc16"
                                : index === 2
                                  ? "#f59e0b"
                                  : "#ef4444"
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* ===================================================
            FRAUD BY AMOUNT
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              Fraud by Transaction Amount
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fraudulent transaction distribution by amount range.
            </p>

          </div>


          {fraudAmountLoading ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-slate-400">
                Loading amount data...
              </p>
            </div>

          ) : fraudAmountError ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-red-500">
                Unable to load amount data.
              </p>
            </div>

          ) : !fraudByAmount ||
            fraudByAmount.length === 0 ? (

            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-slate-400">
                No fraud amount data available.
              </p>
            </div>

          ) : (

            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={fraudByAmount}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="count"
                    name="Fraudulent Transactions"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          HIGH-RISK USERS
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-slate-900">
            High-Risk Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Users with the highest fraud activity and risk scores.
          </p>

        </div>


        {highRiskLoading ? (

          <div className="flex h-40 items-center justify-center">
            <p className="text-slate-400">
              Loading high-risk users...
            </p>
          </div>

        ) : highRiskError ? (

          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-red-500">
              Unable to load high-risk users.
            </p>
          </div>

        ) : !highRiskUsers ||
          highRiskUsers.length === 0 ? (

          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-slate-400">
              No high-risk users found.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-200 text-sm text-slate-500">

                  <th className="px-4 py-3 font-medium">
                    User
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Flagged Transactions
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Maximum Risk
                  </th>

                </tr>

              </thead>


              <tbody>

                {highRiskUsers.map((user) => (

                  <tr
                    key={user.userId}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-4 py-4">

                      <p className="font-medium text-slate-900">
                        {user.username}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.userId}
                      </p>

                    </td>


                    <td className="px-4 py-4">

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {user.flaggedCount}
                      </span>

                    </td>


                    <td className="px-4 py-4">

                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        {Number(
                          user.maxRisk ?? 0
                        ).toFixed(2)}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          ML SERVICES STATUS
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">

        <div className="flex items-start gap-4">

          <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />

          <div>

            <h2 className="font-bold text-amber-900">
              AI Model Services
            </h2>

            <p className="mt-1 text-sm text-amber-700">
              Model metrics and SHAP explainability are currently
              unavailable because the ML service is not responding.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;