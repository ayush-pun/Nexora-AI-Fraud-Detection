import {
  Send,
  History,
  User,
  Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Send Money",
    icon: Send,
    color: "bg-indigo-100 text-indigo-700",
    path: "/send-money",
  },
  {
    title: "Transactions",
    icon: History,
    color: "bg-emerald-100 text-emerald-700",
    path: "/transactions",
  },
  {
    title: "Profile",
    icon: User,
    color: "bg-orange-100 text-orange-700",
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    color: "bg-slate-200 text-slate-700",
    path: "/settings",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-white hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${action.color}`}
              >
                <Icon size={22} />
              </div>

              <h3 className="font-semibold text-slate-900">
                {action.title}
              </h3>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default QuickActions;