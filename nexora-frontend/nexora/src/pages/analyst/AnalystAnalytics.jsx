import { Activity, TrendingUp } from "lucide-react";

const AnalystAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analyst Analytics</h1>
        <p className="mt-2 text-slate-500">
          Monitor fraud trends, suspicious patterns, and resolution outcomes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Flagged Volume", "2,341", "+12.4%"],
          ["Detection Accuracy", "97.6%", "+1.8%"],
          ["Resolution Rate", "83%", "+6.1%"],
        ].map(([label, value, delta]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm font-medium text-green-600">{delta}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Activity className="text-indigo-600" size={20} />
          <h2 className="text-xl font-bold text-slate-900">
            Fraud pattern overview
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Atypical transfer velocity",
            "New device login clusters",
            "Repeated chargeback attempts",
            "Wallet fan-out behavior",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalystAnalytics;
