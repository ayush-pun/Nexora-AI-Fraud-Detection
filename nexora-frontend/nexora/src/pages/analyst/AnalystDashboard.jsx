import {
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

const AnalystDashboard = () => {
  const stats = [
    {
      title: "Open Cases",
      value: "18",
      icon: ShieldAlert,
      accent: "text-amber-600 bg-amber-50",
    },
    {
      title: "Escalated",
      value: "7",
      icon: AlertTriangle,
      accent: "text-purple-600 bg-purple-50",
    },
    {
      title: "Resolved",
      value: "41",
      icon: TrendingUp,
      accent: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analyst Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Review high-risk transactions and resolve fraud investigations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(({ title, value, icon: Icon, accent }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{title}</p>
              <div className={`rounded-xl p-2 ${accent}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="text-indigo-600" size={20} />
            <h2 className="text-xl font-bold text-slate-900">Review Queue</h2>
          </div>

          <div className="space-y-4">
            {[
              ["TRX-10452", "High risk transfer", "Open"],
              ["TRX-10398", "Suspicious wallet activity", "In Review"],
              ["TRX-10321", "Legitimate flagged payment", "Escalated"],
            ].map(([ref, note, status]) => (
              <div
                key={ref}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{ref}</p>
                  <p className="text-sm text-slate-500">{note}</p>
                </div>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Analyst Permissions
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Review flagged fraud cases</li>
            <li>• Confirm or reject suspicious transactions</li>
            <li>• View analyst-only analytics</li>
            <li>• Access case resolution workflow</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
