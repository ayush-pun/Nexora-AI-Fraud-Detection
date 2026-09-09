import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter,
  ShieldAlert,
} from "lucide-react";

const AnalystFraudCases = () => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const cases = [
    {
      id: 1,
      transaction: "TRX-10452",
      amount: "NPR 58,400",
      risk: "92",
      status: "OPEN",
      priority: "HIGH",
    },
    {
      id: 2,
      transaction: "TRX-10398",
      amount: "NPR 14,200",
      risk: "74",
      status: "IN_REVIEW",
      priority: "MEDIUM",
    },
    {
      id: 3,
      transaction: "TRX-10281",
      amount: "NPR 8,950",
      risk: "67",
      status: "ESCALATED",
      priority: "HIGH",
    },
  ];

  const filteredCases = cases.filter((item) => {
    if (selectedStatus === "ALL") return true;
    return item.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fraud Cases</h1>
          <p className="mt-2 text-slate-500">
            Review and resolve investigations assigned to the analyst queue.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
          >
            <option value="ALL">All Cases</option>
            <option value="OPEN">Open</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Risk</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {caseItem.transaction}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {caseItem.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                      {caseItem.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                      <Eye size={15} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalystFraudCases;
